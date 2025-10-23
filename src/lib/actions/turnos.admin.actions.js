'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getTurnsForAdminDashboard() {
  try {
    const db = admin.firestore();
    const timeZone = 'America/Argentina/Buenos_Aires';

    const turnosSnapshot = await db.collectionGroup('turnos')
                                 .orderBy('fecha', 'desc')
                                 .orderBy('necesitaTraslado', 'asc')
                                 .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: { hoy: [], proximos: [], finalizados: [] } };
    }

    const userIds = new Set();
    const petIds = new Map(); 

    const allTurnos = turnosSnapshot.docs.map(doc => {
      const data = doc.data();
      const pathSegments = doc.ref.path.split('/');
      const userId = pathSegments[1];
      const mascotaId = pathSegments[3];
      
      userIds.add(userId);
      if (!petIds.has(mascotaId)) {
        petIds.set(mascotaId, userId);
      }

      return {
        id: doc.id,
        ...data,
        fecha: typeof data.fecha.toDate === 'function' ? data.fecha.toDate().toISOString() : data.fecha,
        userId,
        mascotaId,
      };
    });

    const usersCache = new Map();
    if (userIds.size > 0) {
      const userDocs = await db.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', [...userIds]).get();
      userDocs.forEach(doc => usersCache.set(doc.id, doc.data()));
    }

    const mascotasCache = new Map();
    if (petIds.size > 0) {
      const petPromises = Array.from(petIds.entries()).map(([petId, userId]) => 
        db.collection('users').doc(userId).collection('mascotas').doc(petId).get()
      );
      const petDocs = await Promise.all(petPromises);
      petDocs.forEach(doc => {
        if (doc.exists) {
          mascotasCache.set(doc.id, doc.data());
        }
      });
    }

    const enrichedTurnos = allTurnos.map(turno => {
      const user = usersCache.get(turno.userId);
      const mascota = mascotasCache.get(turno.mascotaId);
      return {
        ...turno,
        user: { nombre: user?.nombre || 'Usuario', apellido: user?.apellido || 'Eliminado' },
        mascota: { nombre: mascota?.nombre || 'Mascota Eliminada' },
      };
    });

    const nowInArgentina = dayjs().tz(timeZone);
    const startOfTodayInArgentina = nowInArgentina.startOf('day');
    const endOfTodayInArgentina = nowInArgentina.endOf('day');

    const hoy = [];
    const proximos = [];
    const finalizados = [];

    for (const turno of enrichedTurnos) {
      const fechaTurno = dayjs(turno.fecha);

      if (turno.estado === 'finalizado' || turno.estado === 'cancelado') {
        finalizados.push(turno);
      } else if (fechaTurno.isAfter(startOfTodayInArgentina) && fechaTurno.isBefore(endOfTodayInArgentina)) {
        hoy.push(turno);
      } else if (fechaTurno.isAfter(nowInArgentina) && (turno.estado === 'pendiente' || turno.estado === 'confirmado')) {
        proximos.push(turno);
      } else if (fechaTurno.isBefore(startOfTodayInArgentina) && (turno.estado === 'pendiente' || turno.estado === 'confirmado')){
        finalizados.push(turno);
      }
    }
    
    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return { 
      success: true, 
      data: { hoy, proximos, finalizados } 
    };

  } catch (error) {
    console.error("Error general en getTurnsForAdminDashboard:", error);
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}

export async function updateTurnoStatus({ userId, mascotaId, turnoId, newStatus }) {
  try {
    if (!userId || !mascotaId || !turnoId || !newStatus) {
      throw new Error("Faltan parámetros requeridos para actualizar el turno.");
    }

    const db = admin.firestore();
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);

    await turnoRef.update({ estado: newStatus });

    revalidatePath('/admin/turnos');

    return { success: true, message: `Turno actualizado a ${newStatus}.` };
  } catch (error) {
    console.error("Error en updateTurnoStatus:", error);
    return { success: false, error: `Error al actualizar el turno: ${error.message}` };
  }
}
