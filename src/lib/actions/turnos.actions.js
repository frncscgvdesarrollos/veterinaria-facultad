'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { verificarDisponibilidadTraslado } from '../logica_traslado';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const firestore = admin.firestore();
const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

export async function verificarDisponibilidadTrasladoAction({ fecha, nuevasMascotas }) {
    try {
        if (!fecha || !nuevasMascotas) {
            throw new Error('Faltan datos para la verificación del traslado.');
        }
        const timeZone = 'America/Argentina/Buenos_Aires';
        const startOfDay = dayjs.tz(fecha, timeZone).startOf('day');
        const endOfDay = startOfDay.add(1, 'day');
        const startOfDayTimestamp = admin.firestore.Timestamp.fromDate(startOfDay.toDate());
        const endOfDayTimestamp = admin.firestore.Timestamp.fromDate(endOfDay.toDate());
        
        const turnosSnap = await firestore.collectionGroup('turnos')
            .where('necesitaTraslado', '==', true)
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

    if (!user || !user.uid) return { success: false, error: 'Usuario no autenticado.' };

    const batch = firestore.batch();
    const timeZone = 'America/Argentina/Buenos_Aires';

    try {
        for (const mascota of selectedMascotas) {
            const motivos = motivosPorMascota[mascota.id] || {};
            const serviciosSeleccionados = specificServices[mascota.id] || {};

            if (motivos.clinica && serviciosSeleccionados.clinica) {
                if (!horarioClinica || !horarioClinica.fecha || !horarioClinica.hora) {
                    throw new Error('Falta seleccionar la fecha o la hora para el turno de clínica.');
                }
                const [hours, minutes] = horarioClinica.hora.split(':').map(Number);
                const servicioId = serviciosSeleccionados.clinica;
                const servicioData = catalogoServicios.clinica.find(s => s.id === servicioId);
                if (!servicioData) throw new Error(`Servicio de clínica ID=${servicioId} no encontrado.`);

                const fechaTurnoClinica = dayjs.tz(horarioClinica.fecha, timeZone).hour(hours).minute(minutes).second(0);
                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaTurnoClinica.toDate()),
                    horario: horarioClinica.hora, tipo: 'clinica', mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicioId, servicioNombre: servicioData.nombre, precio: servicioData.precio_base || 0,
                    metodoPago: metodoPago, estado: 'pendiente', creadoEn: admin.firestore.FieldValue.serverTimestamp(), necesitaTraslado: false,
                });
            }

            if (motivos.peluqueria && serviciosSeleccionados.peluqueria) {
                if (!horarioPeluqueria || !horarioPeluqueria.fecha || !horarioPeluqueria.turno) {
                    throw new Error('Falta seleccionar la fecha o el turno para el servicio de peluquería.');
                }
                const servicioId = serviciosSeleccionados.peluqueria;
                const servicioData = catalogoServicios.peluqueria.find(s => s.id === servicioId);
                if (!servicioData) throw new Error(`Servicio de peluquería ID=${servicioId} no encontrado.`);
                
                const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
                const precio = servicioData.precios[tamañoKey] || 0;

                let fechaTurnoPeluqueria = dayjs.tz(horarioPeluqueria.fecha, timeZone);
                fechaTurnoPeluqueria = fechaTurnoPeluqueria.hour(horarioPeluqueria.turno === 'mañana' ? 9 : 14).minute(0).second(0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaTurnoPeluqueria.toDate()),
                    horario: horarioPeluqueria.turno, tipo: 'peluqueria', mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicioId, servicioNombre: servicioData.nombre, precio: precio, necesitaTraslado: necesitaTraslado,
                    metodoPago: metodoPago, estado: 'pendiente', creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }

        await batch.commit();

        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true, message: '¡Todos los turnos se guardaron con éxito!' };

    } catch (error) {
        console.error("Error al crear los turnos:", error);
        return { success: false, error: error.message || 'Falló la operación atómica.' };
    }
}

async function updateUserTurno(userId, mascotaId, turnoId, updateData) {
    if (!userId || !mascotaId || !turnoId) return { success: false, error: 'Faltan IDs para localizar el turno.' };
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

export async function cancelarTurnoUsuario(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'ID del turno no proporcionado.' };
    }
    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'cancelado' });

        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true };
    } catch (error) {
        console.error(`Error al cancelar el turno del usuario ${turnoId}:`, error);
        return { success: false, error: 'No se pudo cancelar el turno.' };
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
