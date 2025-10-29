'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const db = admin.firestore();

// Helper para convertir Timestamps de Firestore a ISO Strings de forma segura
const toISOStringSafe = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return typeof timestamp === 'string' ? timestamp : null;
};

// Serializa un objeto turno, convirtiendo todas las fechas
const serializeTurno = (turnoData) => {
    if (!turnoData) return null;
    return {
        ...turnoData,
        fecha: toISOStringSafe(turnoData.fecha),
        creadoEn: toISOStringSafe(turnoData.creadoEn),
    };
};

// --- FUNCIÓN CORREGIDA PARA TRANSPORTE ---
export async function getTurnsForTransporte() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';
    const nowInArgentina = dayjs().tz(timeZone);
    const startOfToday = nowInArgentina.startOf('day').toDate();
    const endOfToday = nowInArgentina.endOf('day').toDate();

    // Consulta simplificada: solo por traslado y fecha. El estado lo filtramos en el servidor.
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
      
      let serializableUser = { id: userId, nombre: 'Usuario', apellido: 'Eliminado', direccion: 'N/A', telefono: 'N/A' };
      if (userId) {
        if (!usersCache.has(userId)) {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            serializableUser = {
              id: userDoc.id,
              nombre: userData.nombre || 'N/A',
              apellido: userData.apellido || 'N/A',
              email: userData.email || 'N/A',
              direccion: userData.direccion || 'N/A', // Añadido
              telefono: userData.telefono || 'N/A',    // Añadido
            };
            usersCache.set(userId, serializableUser);
          }
        } else {
            serializableUser = usersCache.get(userId);
        }
      }
      
      let serializableMascota = { id: mascotaId, nombre: 'Mascota Eliminada' };
      if (userId && mascotaId) {
        const mascotaCacheKey = `${userId}-${mascotaId}`;
        if (!mascotasCache.has(mascotaCacheKey)) {
            const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
            if (mascotaDoc.exists) {
                const mascotaData = mascotaDoc.data();
                serializableMascota = { id: mascotaDoc.id, nombre: mascotaData.nombre || 'N/A' };
                mascotasCache.set(mascotaCacheKey, serializableMascota);
            }
        } else {
            serializableMascota = mascotasCache.get(mascotaCacheKey);
        }
      }

      return {
        id: doc.id,
        ...serializeTurno(turnoData),
        user: serializableUser,
        mascota: serializableMascota,
      };
    });

    const enrichedTurnos = await Promise.all(enrichedTurnosPromises);

    // Filtramos por estado en el código, que es más flexible
    const recogidas = enrichedTurnos.filter(t => t.estado === 'confirmado');
    const entregas = enrichedTurnos.filter(t => t.estado === 'peluqueria finalizada');

    return { success: true, data: { recogidas, entregas } };

  } catch (error) {
    console.error("Error en getTurnsForTransporte:", error);
    return { success: false, error: `Error del servidor: ${error.message}.` };
  }
}

// --- FUNCIÓN PREPARADA PARA PELUQUERÍA ---
export async function getTurnsForPeluqueria() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';
    const nowInArgentina = dayjs().tz(timeZone);
    const startOfToday = nowInArgentina.startOf('day').toDate();
    const endOfToday = nowInArgentina.endOf('day').toDate();

    // Traemos todos los turnos del día que no sean solo de consulta
    const turnosSnapshot = await db.collectionGroup('turnos')
      .where('fecha', '>=', startOfToday)
      .where('fecha', '<=', endOfToday)
      .where('tipo', '==', 'peluqueria')
      .orderBy('fecha', 'asc')
      .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: [] };
    }
    
    // Aquí filtramos solo por los que están 'enVeterinaria'
    const turnosEnPeluqueria = turnosSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(turno => turno.estado === 'enVeterinaria');
    
    if (turnosEnPeluqueria.length === 0) {
        return { success: true, data: [] };
    }

    const usersCache = new Map();
    const mascotasCache = new Map();

    const enrichedTurnosPromises = turnosEnPeluqueria.map(async (turnoData) => {
      const userId = turnoData.clienteId;
      const mascotaId = turnoData.mascotaId;
      
      let serializableUser = { id: userId, nombre: 'Usuario', apellido: 'Eliminado', direccion: 'N/A', telefono: 'N/A' };
      if (userId) {
        if (!usersCache.has(userId)) {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            serializableUser = { id: userDoc.id, nombre: userData.nombre || 'N/A', apellido: userData.apellido || 'N/A', direccion: userData.direccion || 'N/A', telefono: userData.telefono || 'N/A' };
            usersCache.set(userId, serializableUser);
          }
        } else {
          serializableUser = usersCache.get(userId);
        }
      }
      
      let serializableMascota = { id: mascotaId, nombre: 'Mascota Eliminada' };
       if (userId && mascotaId) {
        const mascotaCacheKey = `${userId}-${mascotaId}`;
        if (!mascotasCache.has(mascotaCacheKey)) {
          const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
          if (mascotaDoc.exists) {
            const mascotaData = mascotaDoc.data();
            serializableMascota = { id: mascotaDoc.id, nombre: mascotaData.nombre || 'N/A' };
            mascotasCache.set(mascotaCacheKey, serializableMascota);
          }
        } else {
            serializableMascota = mascotasCache.get(mascotaCacheKey);
        }
      }

      return {
        id: turnoData.id,
        ...serializeTurno(turnoData),
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

// --- FUNCIÓN DE ACTUALIZACIÓN DE ESTADO CORREGIDA ---
export async function updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus }) {
  try {
    if (!userId || !mascotaId || !turnoId || !newStatus) {
      throw new Error("Faltan parámetros requeridos para actualizar el estado.");
    }
    
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);
    
    // El estado se actualiza directamente al que se pasa como parámetro
    await turnoRef.update({ estado: newStatus });

    // Revalidamos las rutas para que los cambios se reflejen en la UI
    revalidatePath('/admin/turnos');
    revalidatePath('/admin/empleados/transporte');
    revalidatePath('/admin/empleados/peluqueria');
    
    return { success: true, message: `Turno actualizado a ${newStatus}.` };

  } catch (error) {
    console.error("Error en updateTurnoStatusByEmpleado:", error);
    return { success: false, error: `Error al actualizar: ${error.message}` };
  }
}
