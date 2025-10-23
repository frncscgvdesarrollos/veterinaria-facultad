'use server';

import admin from '@/lib/firebaseAdmin';
import { verificarDisponibilidadTraslado } from '@/lib/logica_traslado';

/**
 * @action checkTrasladoAvailability
 * @description (CORREGIDO) Verifica la disponibilidad del servicio de traslado para una fecha y un grupo de mascotas específicos.
 * Utiliza el campo 'necesitaTraslado' para consistencia con el resto de la aplicación.
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
    // Se establece la hora a las 00:00:00 UTC para la comparación
    const startOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 23, 59, 59, 999));

    // 1. Obtener todos los turnos con traslado para el día especificado.
    // CORRECCIÓN: Se utiliza 'necesitaTraslado' para coincidir con la base de datos.
    const turnosConTrasladoSnapshot = await db.collectionGroup('turnos')
      .where('necesitaTraslado', '==', true)
      .where('fecha', '>=', startOfDay)
      .where('fecha', '<', endOfDay)
      .get();

    if (turnosConTrasladoSnapshot.empty) {
      const disponible = verificarDisponibilidadTraslado([], mascotas);
      return { disponible };
    }

    // 2. Enriquecer los datos de los turnos existentes.
    const turnosDelDia = [];
    // NOTA: Esta parte sigue siendo menos eficiente (potencial N+1), pero es menos crítica
    // que la pantalla de admin porque se ejecuta con menos datos (solo un día y bajo demanda del usuario).
    // Por ahora, la prioridad es la consistencia.
    for (const doc of turnosConTrasladoSnapshot.docs) {
        const turnoData = doc.data();
        const pathParts = doc.ref.path.split('/');
        const userId = pathParts[1];
        const mascotaId = pathParts[3];

        const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
        if (mascotaDoc.exists) {
            // La lógica de verificación solo necesita el tamaño.
            turnosDelDia.push({ mascota: { tamaño: mascotaDoc.data().tamaño } });
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
