
"use server";

import admin from '@/lib/firebaseAdmin';
import { verificarDisponibilidadTraslado } from '@/lib/logica_traslado';

/**
 * @action checkTrasladoAvailability
 * @description Verifica la disponibilidad del servicio de traslado para una fecha y un grupo de mascotas específicos.
 * Esta acción es llamada desde el formulario de creación de turnos.
 * 
 * @param {{ fecha: string, mascotas: Array<Object> }} params - Los parámetros para la verificación.
 * @returns {Promise<{disponible: boolean, error?: string}>} - Un objeto indicando si hay disponibilidad.
 */
export async function checkTrasladoAvailability({ fecha, mascotas }) {
  try {
    if (!fecha || !mascotas || mascotas.length === 0) {
      throw new Error("La fecha y la lista de mascotas son requeridas.");
    }

    const db = admin.firestore();
    const targetDate = new Date(fecha);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // 1. Obtener todos los turnos con traslado para el día especificado.
    const turnosConTrasladoSnapshot = await db.collectionGroup('turnos')
      .where('necesitaTransporte', '==', true)
      .where('fecha', '>=', startOfDay)
      .where('fecha', '<', endOfDay)
      .get();

    if (turnosConTrasladoSnapshot.empty) {
      // Si no hay turnos existentes, solo verificamos las nuevas mascotas contra el inventario total.
      const disponible = verificarDisponibilidadTraslado([], mascotas);
      return { disponible };
    }

    // 2. Enriquecer los datos de los turnos existentes con la info de la mascota.
    const turnosDelDia = [];
    for (const doc of turnosConTrasladoSnapshot.docs) {
        const turnoData = doc.data();
        const pathParts = doc.ref.path.split('/');
        const userId = pathParts[1];
        const mascotaId = pathParts[3];

        const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
        if (mascotaDoc.exists) {
            turnosDelDia.push({ ...turnoData, mascota: mascotaDoc.data() });
        }
    }
    
    // 3. Llamar a la lógica de verificación.
    const disponible = verificarDisponibilidadTraslado(turnosDelDia, mascotas);

    return { disponible };

  } catch (error) {
    console.error("Error en checkTrasladoAvailability:", error);
    return { disponible: false, error: `Error del servidor: ${error.message}` };
  }
}
