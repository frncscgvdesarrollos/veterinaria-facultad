'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const db = admin.firestore();

const toISOStringOrNull = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return null;
};

export async function getTurnsForAdminDashboard() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';

    const turnosSnapshot = await db.collectionGroup('turnos')
                                 .orderBy('fecha', 'desc')
                                 .orderBy('tipo', 'asc')
                                 .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: { hoy: [], proximos: [], finalizados: [], reprogramar: [] } };
    }

    const usersCache = new Map();
    const mascotasCache = new Map();

    const enrichedTurnosPromises = turnosSnapshot.docs.map(async (doc) => {
      const turnoData = doc.data();
      const userId = turnoData.clienteId;
      const mascotaId = turnoData.mascotaId;
      
      let serializableUser = { id: userId, nombre: 'Usuario', apellido: 'Eliminado', email: 'N/A' };
      let serializableMascota = { id: mascotaId, nombre: 'Mascota Eliminada', especie: 'N/A', fechaNacimiento: null };

      if (userId) {
        if (usersCache.has(userId)) {
          serializableUser = usersCache.get(userId);
        } else {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            serializableUser = {
              id: userDoc.id,
              nombre: userData.nombre || 'N/A',
              apellido: userData.apellido || 'N/A',
              email: userData.email || 'N/A',
            };
            usersCache.set(userId, serializableUser);
          }
        }
      }
      
      if (userId && mascotaId) {
        const mascotaCacheKey = `${userId}-${mascotaId}`;
        if (mascotasCache.has(mascotaCacheKey)) {
            serializableMascota = mascotasCache.get(mascotaCacheKey);
        } else {
            const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
            if (mascotaDoc.exists) {
                const mascotaData = mascotaDoc.data();
                serializableMascota = {
                  id: mascotaDoc.id,
                  nombre: mascotaData.nombre || 'N/A',
                  especie: mascotaData.especie || 'N/A',
                  raza: mascotaData.raza || 'N/A',
                  fechaNacimiento: toISOStringOrNull(mascotaData.fechaNacimiento),
                };
                mascotasCache.set(mascotaCacheKey, serializableMascota);
            }
        }
      }

      return {
        id: doc.id,
        userId: turnoData.clienteId,
        mascotaId: turnoData.mascotaId,
        tipo: turnoData.tipo,
        servicioNombre: turnoData.servicioNombre,
        estado: turnoData.estado,
        necesitaTraslado: turnoData.necesitaTraslado || false,
        fecha: toISOStringOrNull(turnoData.fecha),
        user: serializableUser,
        mascota: serializableMascota,
      };
    });

    const enrichedTurnos = await Promise.all(enrichedTurnosPromises);

    const nowInArgentina = dayjs().tz(timeZone);
    const startOfTodayInArgentina = nowInArgentina.startOf('day');
    const endOfTodayInArgentina = nowInArgentina.endOf('day');

    const hoy = [];
    const proximos = [];
    const finalizados = [];
    const reprogramar = [];

    for (const turno of enrichedTurnos) {
      if (!turno.fecha) continue;
      const fechaTurno = dayjs(turno.fecha);

      if (turno.estado === 'reprogramar') {
        reprogramar.push(turno);
      } else if (turno.estado === 'finalizado' || turno.estado === 'cancelado') {
        finalizados.push(turno);
      } else if (fechaTurno.isAfter(startOfTodayInArgentina) && fechaTurno.isBefore(endOfTodayInArgentina) && turno.estado === 'confirmado') {
        hoy.push(turno);
      } else if (fechaTurno.isAfter(nowInArgentina) && turno.estado === 'pendiente') {
        proximos.push(turno);
      } else if (fechaTurno.isBefore(startOfTodayInArgentina) && (turno.estado === 'pendiente' || turno.estado === 'confirmado')) {
        finalizados.push(turno);
      }
    }
    
    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    finalizados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    hoy.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    reprogramar.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return { success: true, data: { hoy, proximos, finalizados, reprogramar } };

  } catch (error) {
    console.error("Error en getTurnsForAdminDashboard:", error);
    return { success: false, error: `Error del servidor: ${error.message}.` };
  }
}

// --- ¡AQUÍ ESTÁ LA MODIFICACIÓN! ---
// La función ahora acepta un parámetro opcional 'newDate' para manejar la reprogramación.
export async function updateTurnoStatus({ userId, mascotaId, turnoId, newStatus, newDate }) {
  try {
    if (!userId || !mascotaId || !turnoId || !newStatus) {
      throw new Error("Faltan parámetros requeridos.");
    }
    
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);
    
    // Construimos el objeto de actualización dinámicamente.
    const updateData = {
      estado: newStatus
    };

    // Si se proporciona una nueva fecha (al reprogramar), la añadimos a la actualización.
    if (newDate) {
      // Convertimos la fecha (que probablemente viene como string) a un Timestamp de Firestore.
      updateData.fecha = admin.firestore.Timestamp.fromDate(new Date(newDate));
    }

    await turnoRef.update(updateData);
    
    // Revalidamos la ruta para que el dashboard se actualice inmediatamente.
    revalidatePath('/admin/turnos');
    
    return { success: true, message: `Turno actualizado.` };

  } catch (error) {
    console.error("Error en updateTurnoStatus:", error);
    return { success: false, error: `Error al actualizar: ${error.message}` };
  }
}
