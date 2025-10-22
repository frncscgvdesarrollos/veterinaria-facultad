
"use server";

import { firestore } from '@/lib/firebaseAdmin'; // Importar 'firestore' ya inicializado
import { revalidatePath } from 'next/cache';

/**
 * @function getAllTurnsForAdmin
 * @description Obtiene todos los turnos de todas las mascotas y usuarios, enriqueciendo los datos.
 * Esta función está diseñada para ser usada exclusivamente en el panel de administración.
 */
export async function getAllTurnsForAdmin() {
  try {
    // Acceder a la db dentro de la función
    const db = firestore;
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
        } else {
          user = { nombre: 'Usuario', apellido: 'No encontrado' };
        }
      }

      let mascota = cache.mascotas[mascotaId];
      if (!mascota) {
        const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
        if (mascotaDoc.exists) {
          const { nombre } = mascotaDoc.data();
          mascota = { nombre };
          cache.mascotas[mascotaId] = mascota;
        } else {
          mascota = { nombre: 'Mascota no encontrada' };
        }
      }
      
      turnsData.push({
        id: turnoDoc.id,
        ...turnoData,
        fecha: turnoData.fecha, // Se mantiene como string o timestamp de Firestore
        userId,
        mascotaId,
        user: user,
        mascota: mascota,
      });
    }
    
    return { success: true, data: turnsData };

  } catch (error) {
    console.error("Error en getAllTurnsForAdmin:", error);
    // Devolver un mensaje de error más específico si es posible
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}
