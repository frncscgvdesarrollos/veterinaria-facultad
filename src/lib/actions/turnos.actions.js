'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { verificarDisponibilidadTraslado } from '../logica_traslado';

const firestore = admin.firestore();

const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

// Mantenemos las funciones de creación y verificación que ya fueron corregidas.

export async function verificarDisponibilidadTrasladoAction({ fecha, nuevasMascotas }) {
    try {
        if (!fecha || !nuevasMascotas) {
            throw new Error('Faltan datos para la verificación del traslado.');
        }

        const startOfDay = new Date(fecha);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        const startOfDayTimestamp = admin.firestore.Timestamp.fromDate(startOfDay);
        const endOfDayTimestamp = admin.firestore.Timestamp.fromDate(endOfDay);
        
        const turnosSnap = await firestore.collectionGroup('turnos')
            .where('necesitaTraslado', '==', true) // CORREGIDO: Usar 'necesitaTraslado' consistentemente
            .where('fecha', '>=', startOfDayTimestamp)
            .where('fecha', '<', endOfDayTimestamp)
            .get();

        const turnosDelDia = turnosSnap.docs.map(doc => ({ mascota: { tamaño: doc.data().mascotaTamaño } }));

        const hayDisponibilidad = verificarDisponibilidadTraslado(turnosDelDia, nuevasMascotas);

        if (!hayDisponibilidad) {
            return { success: false, error: 'No hay más lugar en el vehículo de traslado para la fecha seleccionada.' };
        }

        return { success: true };

    } catch (error) {
        console.error("Error al verificar disponibilidad de traslado:", error);
        return { success: false, error: error.message || 'No se pudo completar la verificación.' };
    }
}

export async function crearTurnos(user, data) {
    const { selectedMascotas, motivosPorMascota, specificServices, horarioClinica, horarioPeluqueria, necesitaTraslado, metodoPago, catalogoServicios } = data;

    if (!user || !user.uid) {
        return { success: false, error: 'Usuario no autenticado.' };
    }

    const batch = firestore.batch();

    try {
        for (const mascota of selectedMascotas) {
            const motivos = motivosPorMascota[mascota.id] || {};
            const serviciosSeleccionados = specificServices[mascota.id] || {};

            if (motivos.clinica && serviciosSeleccionados.clinica) {
                const servicioId = serviciosSeleccionados.clinica;
                const servicio = catalogoServicios.clinica.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de clínica no encontrado para ${mascota.nombre}`);

                const fechaClinica = new Date(horarioClinica.fecha);
                const [hours, minutes] = horarioClinica.hora.split(':').map(Number);
                fechaClinica.setHours(hours, minutes, 0, 0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaClinica),
                    horario: horarioClinica.hora,
                    tipo: 'clinica',
                    mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id, servicioNombre: servicio.nombre, precio: servicio.precio_base || 0,
                    metodoPago: metodoPago, estado: 'pendiente', creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                    necesitaTraslado: false // Clínica no tiene traslado
                });
            }

            if (motivos.peluqueria && serviciosSeleccionados.peluqueria) {
                const servicioId = serviciosSeleccionados.peluqueria;
                const servicio = catalogoServicios.peluqueria.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de peluquería no encontrado para ${mascota.nombre}`);
                
                const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
                const precio = servicio.precios[tamañoKey] || 0;

                const fechaPeluqueria = new Date(horarioPeluqueria.fecha);
                fechaPeluqueria.setHours(0, 0, 0, 0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaPeluqueria),
                    horario: horarioPeluqueria.turno,
                    tipo: 'peluqueria',
                    mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id, servicioNombre: servicio.nombre, precio: precio,
                    necesitaTraslado: necesitaTraslado, // CORREGIDO: Usar 'necesitaTraslado'
                    metodoPago: metodoPago, estado: 'pendiente', creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }

        await batch.commit();
        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');
        return { success: true };

    } catch (error) {
        console.error("Error al crear los turnos:", error);
        return { success: false, error: error.message || 'No se pudo completar la creación de los turnos.' };
    }
}

// --- ACCIONES DE MODIFICACIÓN CORREGIDAS ---

async function updateUserTurno(userId, mascotaId, turnoId, updateData) {
    if (!userId || !mascotaId || !turnoId) {
        return { success: false, error: 'Faltan IDs para localizar el turno.' };
    }
    try {
        const turnoRef = firestore.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);
        await turnoRef.update(updateData);
        revalidatePath('/admin/turnos');
        revalidatePath('/turnos/mis-turnos');
        return { success: true };
    } catch (error) {
        console.error(`Error al actualizar turno ${turnoId}:`, error);
        return { success: false, error: 'Error al actualizar el estado del turno.' };
    }
}

export async function confirmarTurno({ userId, mascotaId, turnoId }) {
    return updateUserTurno(userId, mascotaId, turnoId, { estado: 'confirmado' });
}

export async function cancelarTurno({ userId, mascotaId, turnoId }) {
    return updateUserTurno(userId, mascotaId, turnoId, { estado: 'cancelado' });
}

export async function finalizarTurno({ userId, mascotaId, turnoId }) {
    return updateUserTurno(userId, mascotaId, turnoId, { estado: 'finalizado' });
}

export async function modificarTurno({ userId, mascotaId, turnoId, nuevosDatos }) {
    return updateUserTurno(userId, mascotaId, turnoId, nuevosDatos);
}
