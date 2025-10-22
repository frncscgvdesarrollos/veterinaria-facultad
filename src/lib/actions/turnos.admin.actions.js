
"use server";

// 1. Importar 'admin' como exportación por defecto, que es lo correcto según tu archivo firebaseAdmin.js
import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

/**
 * @function getAllTurnsForAdmin
 * @description Obtiene todos los turnos de todas las mascotas y usuarios, enriqueciendo los datos.
 * Esta función está diseñada para ser usada exclusivamente en el panel de administración.
 */
export async function getAllTurnsForAdmin() {
  try {
    // 2. Obtener la instancia de la base de datos DENTRO de la función para asegurar la inicialización.
    const db = admin.firestore();
    
    // 3. La consulta ahora usará el índice que creaste (fecha DESC, tipo ASC).
    const turnosSnapshot = await db.collectionGroup('turnos').orderBy('fecha', 'desc').get();
    
    if (turnosSnapshot.empty) {
      return { success: true, data: [] };
    }

    const turnsData = [];
    // Usar un Map para el cache es ligeramente más eficiente
    const cache = { users: new Map(), mascotas: new Map() };

    for (const turnoDoc of turnosSnapshot.docs) {
      const turnoData = turnoDoc.data();
      const pathSegments = turnoDoc.ref.path.split('/');
      const userId = pathSegments[1];
      const mascotaId = pathSegments[3];

      let user = cache.users.get(userId);
      if (!user) {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const { nombre, apellido } = userDoc.data();
          user = { nombre, apellido };
          cache.users.set(userId, user);
        } else {
          user = { nombre: 'Usuario', apellido: 'No encontrado' };
        }
      }

      let mascota = cache.mascotas.get(mascotaId);
      if (!mascota) {
        const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
        if (mascotaDoc.exists) {
          const { nombre } = mascotaDoc.data();
          mascota = { nombre };
          cache.mascotas.set(mascotaId, mascota);
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
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}
