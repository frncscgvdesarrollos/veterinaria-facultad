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
/**
 * @action getTurnosByUserId
 * @description Obtiene y clasifica todos los turnos para un usuario específico desde Firestore.
 * Esta función requiere un índice de Grupo de Colección en Firestore: (clienteId ASC, fecha DESC, tipo DESC).
 * 
 * @param {{ userId: string }} params - El ID del usuario (uid) para el cual buscar los turnos.
 * @returns {Promise<{success: boolean, data?: {proximos: Array, historial: Array}, error?: string}>}
 */
export async function getTurnosByUserId({ userId }) {
  if (!userId) {
    return { success: false, error: 'ID de usuario no proporcionado.' };
  }

  try {
    const db = admin.firestore();
    // Esta consulta ahora requiere un índice de Grupo de Colección en (clienteId ASC, fecha DESC, tipo DESC).
    const turnosSnapshot = await db.collectionGroup('turnos')
                                   .where('clienteId', '==', userId)
                                   .orderBy('fecha', 'desc')
                                   .orderBy('tipo', 'desc')
                                   .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: { proximos: [], historial: [] } };
    }

    const ahora = new Date();
    const proximos = [];
    const historial = [];

    const processedTurnosPromises = turnosSnapshot.docs.map(async (doc) => {
      const turno = doc.data();

      if (!turno.fecha || typeof turno.fecha.toDate !== 'function') {
        console.warn(`Turno ${doc.id} para el usuario ${userId} ha sido ignorado por tener una fecha inválida.`);
        return null;
      }
      
      const fechaTurno = turno.fecha.toDate();
      
      let mascotaNombre = turno.mascotaNombre || 'Mascota no registrada';
      if (!turno.mascotaNombre) {
          const pathParts = doc.ref.path.split('/');
          const mascotaId = pathParts[3];
          if (mascotaId) {
              const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
              if (mascotaDoc.exists()) {
                  mascotaNombre = mascotaDoc.data().nombre || mascotaNombre;
              }
          }
      }

      const turnoProcesado = {
        id: doc.id,
        servicioNombre: turno.servicioNombre || 'Servicio no especificado',
        estado: turno.estado || 'desconocido',
        tipo: turno.tipo || 'general',
        fecha: fechaTurno.toISOString(),
        mascota: { nombre: mascotaNombre }
      };

      return turnoProcesado;
    });
    
    const resultados = await Promise.all(processedTurnosPromises);
    const turnosValidos = resultados.filter(t => t !== null);

    for (const turno of turnosValidos) {
        const fechaTurno = new Date(turno.fecha);
        if (turno.estado === 'finalizado' || turno.estado === 'cancelado' || (fechaTurno < ahora && turno.estado !== 'reprogramado')) {
            historial.push(turno);
        } else {
            proximos.push(turno);
        }
    }

    // Los próximos se ordenan por fecha ascendente para ver el más cercano primero.
    // El historial ya viene pre-ordenado por la consulta de base de datos (fecha y tipo).
    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return { success: true, data: { proximos, historial } };

  } catch (error) {
    console.error(`Error al obtener los turnos para el usuario ${userId}:`, error);
    // El error de la consola del servidor te dirá si el índice compuesto falta.
    return { success: false, error: 'Error del servidor al buscar los turnos.' };
  }
}
