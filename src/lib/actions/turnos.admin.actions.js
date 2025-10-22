
"use server";

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

/**
 * @function getTurnsForAdminDashboard
 * @description Obtiene y clasifica todos los turnos para el panel de administración.
 * Clasifica los turnos en tres categorías: "hoy", "próximos" y "finalizados".
 * Es robusto contra datos inconsistentes en Firestore.
 */
export async function getTurnsForAdminDashboard() {
  try {
    const db = admin.firestore();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const turnosSnapshot = await db.collectionGroup('turnos').orderBy('fecha', 'desc').orderBy('necesitaTransporte', 'asc').get();

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
      // **INICIO DE LA MODIFICACIÓN**
      try { 
        const turnoData = turnoDoc.data();
        if (!turnoData || !turnoData.fecha) {
            console.warn(`Turno ${turnoDoc.id} omitido por datos incompletos.`);
            continue; // Salta a la siguiente iteración si el turno no tiene datos o fecha
        }

        const fechaTurno = typeof turnoData.fecha.toDate === 'function' 
          ? turnoData.fecha.toDate() 
          : new Date(turnoData.fecha);

        const enrichTurnoData = async () => {
          const pathSegments = turnoDoc.ref.path.split('/');
          const userId = pathSegments[1];
          const mascotaId = pathSegments[3];

          let user = cache.users.get(userId);
          if (!user) {
            const userDoc = await db.collection('users').doc(userId).get();
            user = userDoc.exists ? userDoc.data() : null; // Guardar null si no existe
            cache.users.set(userId, user);
          }

          let mascota = cache.mascotas.get(mascotaId);
          if (!mascota) {
            const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
            mascota = mascotaDoc.exists ? mascotaDoc.data() : null; // Guardar null si no existe
            cache.mascotas.set(mascotaId, mascota);
          }
          
          return {
            id: turnoDoc.id,
            ...turnoData,
            fecha: fechaTurno.toISOString(),
            userId,
            mascotaId,
            // Usar optional chaining y valores por defecto para evitar errores
            user: { nombre: user?.nombre || 'Usuario', apellido: user?.apellido || 'Eliminado' },
            mascota: { nombre: mascota?.nombre || 'Mascota Eliminada' },
          };
        };

        const enrichedTurno = await enrichTurnoData();

        if (enrichedTurno.estado === 'finalizado' || enrichedTurno.estado === 'cancelado') {
          turnosFinalizados.push(enrichedTurno);
        } else if (fechaTurno >= startOfToday && fechaTurno < endOfToday) {
          turnosHoy.push(enrichedTurno);
        } else if (fechaTurno > now && enrichedTurno.estado === 'pendiente') {
          turnosProximos.push(enrichedTurno);
        }
      } catch (error) {
        // Si un turno individual falla, lo registramos pero no detenemos toda la ejecución.
        console.error(`Error procesando el turno con ID ${turnoDoc.id}:`, error);
      }
      // **FIN DE LA MODIFICACIÓN**
    }
    
    return { 
      success: true, 
      data: { 
        hoy: turnosHoy, 
        proximos: turnosProximos, 
        finalizados: turnosFinalizados 
      } 
    };

  } catch (error) {
    // Este catch atrapa errores más generales, como problemas de conexión con Firestore.
    console.error("Error general en getTurnsForAdminDashboard:", error);
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}

/**
 * @function updateTurnoStatus
 * @description Actualiza el estado de un turno específico.
 */
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
