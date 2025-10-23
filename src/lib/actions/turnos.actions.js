'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { verificarDisponibilidadTraslado } from '../logica_traslado';

const firestore = admin.firestore();

const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

/**
 * Server Action para verificar la disponibilidad del vehículo de traslado.
 * @param {{ fecha: string, nuevasMascotas: Array<{ tamaño: string }> }}
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verificarDisponibilidadTrasladoAction({ fecha, nuevasMascotas }) {
    try {
        if (!fecha || !nuevasMascotas) {
            throw new Error('Faltan datos para la verificación del traslado.');
        }

        // **INICIO DE LA MODIFICACIÓN**
        // Crear rango de Timestamps para consultar un día completo
        const startOfDay = new Date(fecha);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        const startOfDayTimestamp = admin.firestore.Timestamp.fromDate(startOfDay);
        const endOfDayTimestamp = admin.firestore.Timestamp.fromDate(endOfDay);
        
        // Consulta por rango de Timestamps (requiere nuevo índice)
        const turnosSnap = await firestore.collectionGroup('turnos')
            .where('necesitaTraslado', '==', true)
            .where('fecha', '>=', startOfDayTimestamp)
            .where('fecha', '<', endOfDayTimestamp)
            .get();
        // **FIN DE LA MODIFICACIÓN**

        const turnosDelDia = turnosSnap.docs.map(doc => ({
            mascota: { tamaño: doc.data().mascotaTamaño } 
        }));

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

/**
 * Server Action unificada para crear turnos de clínica y/o peluquería.
 * @param {object} user - Objeto del usuario autenticado.
 * @param {object} data - Datos del formulario del wizard.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function crearTurnos(user, data) {
    const {
        selectedMascotas,
        motivosPorMascota,
        specificServices,
        horarioClinica,
        horarioPeluqueria,
        necesitaTraslado,
        metodoPago,
        catalogoServicios
    } = data;

    if (!user || !user.uid) {
        return { success: false, error: 'Usuario no autenticado.' };
    }

    const batch = firestore.batch();

    try {
        for (const mascota of selectedMascotas) {
            const motivos = motivosPorMascota[mascota.id] || {};
            const serviciosSeleccionados = specificServices[mascota.id] || {};

            // --- Crear Turno de Clínica ---
            if (motivos.clinica && serviciosSeleccionados.clinica) {
                const servicioId = serviciosSeleccionados.clinica;
                const servicio = catalogoServicios.clinica.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de clínica no encontrado para ${mascota.nombre}`);

                // **INICIO DE LA MODIFICACIÓN**
                // Combinar fecha y hora, y convertir a Timestamp
                const fechaClinica = new Date(horarioClinica.fecha);
                const [hours, minutes] = horarioClinica.hora.split(':').map(Number);
                fechaClinica.setHours(hours, minutes, 0, 0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                const nuevoTurno = {
                    fecha: admin.firestore.Timestamp.fromDate(fechaClinica), // GUARDADO COMO TIMESTAMP
                    horario: horarioClinica.hora,
                    tipo: 'clinica',
                    mascotaId: mascota.id,
                    mascotaNombre: mascota.nombre,
                    mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id,
                    servicioNombre: servicio.nombre,
                    precio: servicio.precio_base || 0,
                    metodoPago: metodoPago,
                    estado: 'pendiente',
                    creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                };
                // **FIN DE LA MODIFICACIÓN**
                batch.set(turnoRef, nuevoTurno);
            }

            // --- Crear Turno de Peluquería ---
            if (motivos.peluqueria && serviciosSeleccionados.peluqueria) {
                const servicioId = serviciosSeleccionados.peluqueria;
                const servicio = catalogoServicios.peluqueria.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de peluquería no encontrado para ${mascota.nombre}`);
                
                const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
                const precio = servicio.precios[tamañoKey] || 0;

                // **INICIO DE LA MODIFICACIÓN**
                // Convertir fecha a Timestamp (inicio del día)
                const fechaPeluqueria = new Date(horarioPeluqueria.fecha);
                fechaPeluqueria.setHours(0, 0, 0, 0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                const nuevoTurno = {
                    fecha: admin.firestore.Timestamp.fromDate(fechaPeluqueria), // GUARDADO COMO TIMESTAMP
                    horario: horarioPeluqueria.turno,
                    tipo: 'peluqueria',
                    mascotaId: mascota.id,
                    mascotaNombre: mascota.nombre,
                    mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id,
                    servicioNombre: servicio.nombre,
                    precio: precio,
                    necesitaTraslado: necesitaTraslado,
                    metodoPago: metodoPago,
                    estado: 'pendiente',
                    creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                };
                // **FIN DE LA MODIFICACIÓN**
                batch.set(turnoRef, nuevoTurno);
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


// --- Otras acciones (confirmar, cancelar) se mantienen igual, pero podrían necesitar ajustes si la lógica de negocio cambia ---

export async function confirmarTurno(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }
    try {
        // Esta función podría necesitar saber la ruta completa del turno si no están en una colección raíz
        // Por ahora, asumimos que se puede encontrar, pero puede requerir refactorización.
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'confirmado' });
        revalidatePath('/admin/turnos');
        return { success: true };
    } catch (error) {
        console.error("Error al confirmar el turno:", error);
        return { success: false, error: 'Error al actualizar el estado del turno.' };
    }
}

export async function cancelarTurno(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }
    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'cancelado' });
        revalidatePath('/admin/turnos');
        return { success: true };
    } catch (error) {
        console.error("Error al cancelar el turno:", error);
        return { success: false, error: 'Error al actualizar el estado del turno.' };
    }
}

export async function cancelarTurnoUsuario(turnoId) {
     if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }
    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'cancelado' });
        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');
        return { success: true };
    } catch (error) {
        console.error("Error al cancelar el turno por el usuario:", error);
        return { success: false, error: 'Error al procesar la cancelación.' };
    }
}

export async function modificarTurno(turnoId, nuevosDatos) {
    if (!turnoId || !nuevosDatos) {
        return { success: false, error: 'Datos insuficientes para modificar el turno.' };
    }
    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update(nuevosDatos);
        revalidatePath('/admin/turnos');
        revalidatePath('/turnos/mis-turnos');
        return { success: true };
    } catch (error) {
        console.error("Error al modificar el turno:", error);
        return { success: false, error: 'Error al actualizar el turno en la base de datos.' };
    }
}
