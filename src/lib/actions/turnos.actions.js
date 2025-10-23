'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { verificarDisponibilidadTraslado } from '../logica_traslado';
// Importar dayjs con los plugins necesarios
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const firestore = admin.firestore();
const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

// La función de verificación se mantiene igual
export async function verificarDisponibilidadTrasladoAction({ fecha, nuevasMascotas }) {
    // ... (código existente sin cambios)
}

/**
 * Server Action unificada para crear turnos de clínica y/o peluquería.
 * @description (VERSIÓN CORREGIDA Y ROBUSTA) Utiliza dayjs para manejar correctamente las zonas horarias
 * y asigna horas específicas a los turnos de peluquería para mantener la consistencia de los datos.
 */
export async function crearTurnos(user, data) {
    const { selectedMascotas, motivosPorMascota, specificServices, horarioClinica, horarioPeluqueria, necesitaTraslado, metodoPago, catalogoServicios } = data;

    if (!user || !user.uid) {
        return { success: false, error: 'Usuario no autenticado.' };
    }

    const batch = firestore.batch();
    const timeZone = 'America/Argentina/Buenos_Aires';

    try {
        for (const mascota of selectedMascotas) {
            const motivos = motivosPorMascota[mascota.id] || {};
            const serviciosSeleccionados = specificServices[mascota.id] || {};

            // --- Crear Turno de Clínica (Lógica Mejorada con Timezone) ---
            if (motivos.clinica && serviciosSeleccionados.clinica) {
                const servicioId = serviciosSeleccionados.clinica;
                const servicio = catalogoServicios.clinica.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de clínica no encontrado para ${mascota.nombre}`);

                const [hours, minutes] = horarioClinica.hora.split(':').map(Number);
                const fechaTurnoClinica = dayjs.tz(horarioClinica.fecha, timeZone).hour(hours).minute(minutes).second(0);

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaTurnoClinica.toDate()),
                    horario: horarioClinica.hora,
                    tipo: 'clinica', mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id, servicioNombre: servicio.nombre, precio: servicio.precio_base || 0,
                    metodoPago: metodoPago, estado: 'pendiente', creadoEn: admin.firestore.FieldValue.serverTimestamp(),
                    necesitaTraslado: false,
                });
            }

            // --- Crear Turno de Peluquería (Lógica CORREGIDA con Hora Específica) ---
            if (motivos.peluqueria && serviciosSeleccionados.peluqueria) {
                const servicioId = serviciosSeleccionados.peluqueria;
                const servicio = catalogoServicios.peluqueria.find(s => s.id === servicioId);
                if (!servicio) throw new Error(`Servicio de peluquería no encontrado para ${mascota.nombre}`);
                
                const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
                const precio = servicio.precios[tamañoKey] || 0;

                let fechaTurnoPeluqueria = dayjs.tz(horarioPeluqueria.fecha, timeZone);
                if (horarioPeluqueria.turno === 'mañana') {
                    fechaTurnoPeluqueria = fechaTurnoPeluqueria.hour(9).minute(0).second(0);
                } else { // 'tarde'
                    fechaTurnoPeluqueria = fechaTurnoPeluqueria.hour(14).minute(0).second(0);
                }

                const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();
                batch.set(turnoRef, {
                    fecha: admin.firestore.Timestamp.fromDate(fechaTurnoPeluqueria.toDate()),
                    horario: horarioPeluqueria.turno,
                    tipo: 'peluqueria', mascotaId: mascota.id, mascotaNombre: mascota.nombre, mascotaTamaño: mascota.tamaño,
                    servicioId: servicio.id, servicioNombre: servicio.nombre, precio: precio,
                    necesitaTraslado: necesitaTraslado,
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

// --- Las acciones de modificación ya están corregidas y se mantienen ---

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
