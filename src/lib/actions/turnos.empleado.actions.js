'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const db = admin.firestore();

// Helper para convertir Timestamps de Firestore a ISO Strings
const toISOStringOrNull = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return null;
};

// Función para obtener los turnos para la vista del empleado de Transporte
export async function getTurnsForTransporte() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';
    const nowInArgentina = dayjs().tz(timeZone);
    const startOfToday = nowInArgentina.startOf('day').toDate();
    const endOfToday = nowInArgentina.endOf('day').toDate();

    const turnosSnapshot = await db.collectionGroup('turnos')
      .where('necesitaTraslado', '==', true)
      .where('fecha', '>=', startOfToday)
      .where('fecha', '<=', endOfToday)
      .orderBy('fecha', 'asc')
      .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: { recogidas: [], entregas: [] } };
    }

    const usersCache = new Map();
    const mascotasCache = new Map();

    const enrichedTurnosPromises = turnosSnapshot.docs.map(async (doc) => {
      const turnoData = doc.data();
      const userId = turnoData.clienteId;
      const mascotaId = turnoData.mascotaId;
      
      let serializableUser = { id: userId, nombre: 'Usuario', apellido: 'Eliminado' };
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
      
      let serializableMascota = { id: mascotaId, nombre: 'Mascota Eliminada' };
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
            };
            mascotasCache.set(mascotaCacheKey, serializableMascota);
          }
        }
      }

      return {
        id: doc.id,
        ...turnoData,
        fecha: toISOStringOrNull(turnoData.fecha),
        user: serializableUser,
        mascota: serializableMascota,
      };
    });

    const enrichedTurnos = await Promise.all(enrichedTurnosPromises);

    const recogidas = [];
    const entregas = [];

    for (const turno of enrichedTurnos) {
      if (['confirmado', 'buscando'].includes(turno.estado)) {
        recogidas.push(turno);
      } else if (turno.estado === 'peluqueria finalizada') {
        entregas.push(turno);
      }
    }

    return { success: true, data: { recogidas, entregas } };

  } catch (error) {
    console.error("Error en getTurnsForTransporte:", error);
    return { success: false, error: `Error del servidor: ${error.message}.` };
  }
}

// Función para obtener los turnos para la vista del empleado de Peluquería
export async function getTurnsForPeluqueria() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';
    const nowInArgentina = dayjs().tz(timeZone);
    const startOfToday = nowInArgentina.startOf('day').toDate();
    const endOfToday = nowInArgentina.endOf('day').toDate();

    // Estados relevantes para el peluquero: desde que está confirmado hasta que llega a la veterinaria
    const estadosRelevantes = ['confirmado', 'buscando', 'buscado', 'enVeterinaria'];

    const turnosSnapshot = await db.collectionGroup('turnos')
      .where('fecha', '>=', startOfToday)
      .where('fecha', '<=', endOfToday)
      .where('estado', 'in', estadosRelevantes)
      .orderBy('fecha', 'asc')
      .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: [] };
    }

    const usersCache = new Map();
    const mascotasCache = new Map();

    const enrichedTurnosPromises = turnosSnapshot.docs.map(async (doc) => {
      const turnoData = doc.data();
      const userId = turnoData.clienteId;
      const mascotaId = turnoData.mascotaId;
      
      let serializableUser = { id: userId, nombre: 'Usuario', apellido: 'Eliminado' };
      if (userId) {
        if (usersCache.has(userId)) {
          serializableUser = usersCache.get(userId);
        } else {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            serializableUser = { id: userDoc.id, nombre: userData.nombre || 'N/A', apellido: userData.apellido || 'N/A' };
            usersCache.set(userId, serializableUser);
          }
        }
      }
      
      let serializableMascota = { id: mascotaId, nombre: 'Mascota Eliminada' };
      if (userId && mascotaId) {
        const mascotaCacheKey = `${userId}-${mascotaId}`;
        if (mascotasCache.has(mascotaCacheKey)) {
          serializableMascota = mascotasCache.get(mascotaCacheKey);
        } else {
          const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
          if (mascotaDoc.exists) {
            const mascotaData = mascotaDoc.data();
            serializableMascota = { id: mascotaDoc.id, nombre: mascotaData.nombre || 'N/A' };
            mascotasCache.set(mascotaCacheKey, serializableMascota);
          }
        }
      }

      return {
        id: doc.id,
        ...turnoData,
        fecha: toISOStringOrNull(turnoData.fecha),
        user: serializableUser,
        mascota: serializableMascota,
      };
    });

    const enrichedTurnos = await Promise.all(enrichedTurnosPromises);

    return { success: true, data: enrichedTurnos };

  } catch (error) {
    console.error("Error en getTurnsForPeluqueria:", error);
    return { success: false, error: `Error del servidor: ${error.message}.` };
  }
}


// Función para que el empleado actualice el estado de un turno
export async function updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus }) {
  try {
    if (!userId || !mascotaId || !turnoId || !newStatus) {
      throw new Error("Faltan parámetros requeridos para actualizar el estado.");
    }
    
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);
    
    let updateData = { estado: newStatus };

    await db.runTransaction(async (transaction) => {
        transaction.update(turnoRef, updateData);

        if (newStatus === 'buscado') {
            transaction.update(turnoRef, { estado: 'enVeterinaria' });
        } else if (newStatus === 'retirado entregado') {
            transaction.update(turnoRef, { estado: 'finalizado' });
        }
    });

    // Revalidar las rutas para que todos los roles vean el cambio
    revalidatePath('/admin/turnos');
    revalidatePath('/admin/empleados/transporte');
    revalidatePath('/admin/empleados/peluqueria');
    
    return { success: true, message: `Turno actualizado a ${newStatus}.` };

  } catch (error) {
    console.error("Error en updateTurnoStatusByEmpleado:", error);
    return { success: false, error: `Error al actualizar: ${error.message}` };
  }
}
