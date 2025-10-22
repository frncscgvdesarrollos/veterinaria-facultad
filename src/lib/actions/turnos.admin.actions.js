
"use server";

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

/**
 * @function getTurnsForAdminDashboard
 * @description Obtiene y clasifica todos los turnos para el panel de administración.
 * Clasifica los turnos en tres categorías: "hoy", "próximos" y "finalizados".
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
      const turnoData = turnoDoc.data();
      const fechaTurno = turnoData.fecha.toDate();

      const enrichTurnoData = async () => {
        const pathSegments = turnoDoc.ref.path.split('/');
        const userId = pathSegments[1];
        const mascotaId = pathSegments[3];

        let user = cache.users.get(userId);
        if (!user) {
          const userDoc = await db.collection('users').doc(userId).get();
          user = userDoc.exists() ? userDoc.data() : { nombre: 'Usuario', apellido: 'Desc.' };
          cache.users.set(userId, user);
        }

        let mascota = cache.mascotas.get(mascotaId);
        if (!mascota) {
          const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
          mascota = mascotaDoc.exists() ? mascotaDoc.data() : { nombre: 'Mascota Desc.' };
          cache.mascotas.set(mascotaId, mascota);
        }
        
        return {
          id: turnoDoc.id,
          ...turnoData,
          fecha: fechaTurno.toISOString(),
          userId, // importante para las acciones
          mascotaId, // importante para las acciones
          user: { nombre: user.nombre, apellido: user.apellido },
          mascota: { nombre: mascota.nombre },
        };
      };

      if (turnoData.estado === 'finalizado' || turnoData.estado === 'cancelado') {
        turnosFinalizados.push(await enrichTurnoData());
      } else if (fechaTurno >= startOfToday && fechaTurno < endOfToday) {
        turnosHoy.push(await enrichTurnoData());
      } else if (fechaTurno > now && turnoData.estado === 'pendiente') {
        turnosProximos.push(await enrichTurnoData());
      }
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
    console.error("Error en getTurnsForAdminDashboard:", error);
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}

/**
 * @function updateTurnoStatus
 * @description Actualiza el estado de un turno específico (ej. 'confirmado', 'finalizado', 'cancelado').
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
