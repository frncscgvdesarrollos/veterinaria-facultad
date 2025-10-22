
"use server";

import { admin } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const db = admin.firestore();

/**
 * @function getAllTurnsForAdmin
 * @description Obtiene todos los turnos de todas las mascotas y usuarios, enriqueciendo los datos.
 * Esta función está diseñada para ser usada exclusivamente en el panel de administración.
 */
export async function getAllTurnsForAdmin() {
  try {
    const turnosSnapshot = await db.collectionGroup('turnos').orderBy('fecha', 'desc').get();
    
    if (turnosSnapshot.empty) {
      return { success: true, data: [] };
    }

    const turnsData = [];
    const cache = { users: {}, mascotas: {} };

    for (const turnoDoc of turnosSnapshot.docs) {
      const turnoData = turnoDoc.data();
      const pathSegments = turnoDoc.ref.path.split('/');
      const userId = pathSegments[1];
      const mascotaId = pathSegments[3];

      let user = cache.users[userId];
      if (!user) {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const { nombre, apellido } = userDoc.data();
          user = { nombre, apellido };
          cache.users[userId] = user;
        }
      }

      let mascota = cache.mascotas[mascotaId];
      if (!mascota) {
        const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
        if (mascotaDoc.exists) {
          const { nombre } = mascotaDoc.data();
          mascota = { nombre };
          cache.mascotas[mascotaId] = mascota;
        }
      }
      
      turnsData.push({
        id: turnoDoc.id,
        ...turnoData,
        fecha: turnoData.fecha,
        userId,
        mascotaId,
        user: user || { nombre: 'No encontrado', apellido: '' },
        mascota: mascota || { nombre: 'No encontrada' },
      });
    }
    
    return { success: true, data: turnsData };

  } catch (error) {
    console.error("Error en getAllTurnsForAdmin:", error);
    return { success: false, error: "No se pudieron cargar los turnos." };
  }
}
