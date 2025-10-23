'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

/**
 * @function getTurnsForAdminDashboard
 * @description Obtiene y clasifica todos los turnos para el panel de administración.
 * Clasifica los turnos en tres categorías: "hoy", "próximos" y "finalizados".
 * Es robusto contra datos inconsistentes y maneja correctamente la zona horaria de Argentina.
 */
export async function getTurnsForAdminDashboard() {
  try {
    const db = admin.firestore();
    
    const timeZone = 'America/Argentina/Buenos_Aires';
    
    const nowInArgentina = utcToZonedTime(new Date(), timeZone);
    
    const startOfTodayInArgentina = new Date(nowInArgentina);
    startOfTodayInArgentina.setHours(0, 0, 0, 0);

    const endOfTodayInArgentina = new Date(startOfTodayInArgentina);
    endOfTodayInArgentina.setDate(endOfTodayInArgentina.getDate() + 1);
    
    const startOfTodayUTC = zonedTimeToUtc(startOfTodayInArgentina, timeZone);
    const endOfTodayUTC = zonedTimeToUtc(endOfTodayInArgentina, timeZone);

    const turnosSnapshot = await db.collectionGroup('turnos').orderBy('fecha', 'desc').get();

    if (turnosSnapshot.empty) {
      return { 
        success: true, 
        data: { hoy: [], proximos: [], finalizados: [] } 
      };
    }

    const turnosHoy = [];
    const turnosProximos = [];
    const turnosFinalizados = [];
    const cache = { users: new Map(), mascotas: new Map() };

    for (const turnoDoc of turnosSnapshot.docs) {
      try { 
        const turnoData = turnoDoc.data();
        if (!turnoData || !turnoData.fecha || typeof turnoData.fecha.toDate !== 'function') {
            console.warn(`Turno ${turnoDoc.id} omitido por datos o fecha inválida.`);
            continue;
        }

        const fechaTurnoUTC = turnoData.fecha.toDate();

        const enrichTurnoData = async () => {
          const pathSegments = turnoDoc.ref.path.split('/');
          const userId = pathSegments[1];
          const mascotaId = pathSegments[3];

          let user = cache.users.get(userId);
          if (!user) {
            const userDoc = await db.collection('users').doc(userId).get();
            user = userDoc.exists ? userDoc.data() : null;
            cache.users.set(userId, user);
          }

          let mascota = cache.mascotas.get(mascotaId);
          if (!mascota) {
            const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
            mascota = mascotaDoc.exists ? mascotaDoc.data() : null;
            cache.mascotas.set(mascotaId, mascota);
          }
          
          return {
            id: turnoDoc.id,
            ...turnoData,
            fecha: fechaTurnoUTC.toISOString(),
            userId,
            mascotaId,
            user: { nombre: user?.nombre || 'Usuario', apellido: user?.apellido || 'Eliminado' },
            mascota: { nombre: mascota?.nombre || 'Mascota Eliminada' },
          };
        };

        const enrichedTurno = await enrichTurnoData();

        if (enrichedTurno.estado === 'finalizado' || enrichedTurno.estado === 'cancelado') {
          turnosFinalizados.push(enrichedTurno);
        } else if (fechaTurnoUTC >= startOfTodayUTC && fechaTurnoUTC < endOfTodayUTC) {
          turnosHoy.push(enrichedTurno);
        } else if (fechaTurnoUTC > zonedTimeToUtc(nowInArgentina, timeZone) && enrichedTurno.estado === 'pendiente') {
          turnosProximos.push(enrichedTurno);
        }

      } catch (error) {
        console.error(`Error procesando el turno con ID ${turnoDoc.id}:`, error);
      }
    }
    
    return { 
      success: true, 
      data: { 
        hoy: turnosHoy, 
        proximos: turnosProximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
        finalizados: turnosFinalizados 
      } 
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
