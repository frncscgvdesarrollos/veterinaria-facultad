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
      
      // --- INICIO DE LA CORRECCIÓN ---
      const pathParts = doc.ref.path.split('/');
      // La ruta es 'users/{userId}/mascotas/{mascotaId}/turnos/{turnoId}'
      const mascotaId = pathParts[3];
      
      let mascotaNombre = turno.mascotaNombre || 'Mascota no registrada';
      if (!turno.mascotaNombre && mascotaId) {
          const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
          if (mascotaDoc.exists()) {
              mascotaNombre = mascotaDoc.data().nombre || mascotaNombre;
          }
      }

      const turnoProcesado = {
        id: doc.id,
        userId: userId, // ID del usuario añadido para la reprogramación
        mascotaId: mascotaId, // ID de la mascota añadido para la reprogramación
        servicioNombre: turno.servicioNombre || 'Servicio no especificado',
        estado: turno.estado || 'desconocido',
        tipo: turno.tipo || 'general',
        fecha: fechaTurno.toISOString(),
        mascota: { nombre: mascotaNombre }
      };
      // --- FIN DE LA CORRECCIÓN ---

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

    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return { success: true, data: { proximos, historial } };

  } catch (error) {
    console.error(`Error al obtener los turnos para el usuario ${userId}:`, error);
    return { success: false, error: 'Error del servidor al buscar los turnos.' };
  }
}


/**
 * @action reprogramarTurnoPorUsuario
 * @description Permite a un usuario reprogramar un turno que fue marcado para reprogramación por un admin.
 * Busca el turno original por su ID y actualiza la fecha y el estado.
 * 
 * @param {object} params
 * @param {string} params.turnoId - El ID del documento del turno a reprogramar.
 * @param {string} params.userId - El ID del dueño de la mascota (para la ruta del documento).
 * @param {string} params.mascotaId - El ID de la mascota (para la ruta del documento).
 * @param {string | Date} params.nuevaFecha - La nueva fecha y hora seleccionada por el usuario.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function reprogramarTurnoPorUsuario({ turnoId, userId, mascotaId, nuevaFecha }) {
  // Verificación de que todos los datos necesarios están presentes.
  if (!turnoId || !userId || !mascotaId || !nuevaFecha) {
    return { success: false, error: 'Faltan datos esenciales para completar la reprogramación.' };
  }

  try {
    const db = admin.firestore();
    
    // 1. Construimos la ruta exacta al documento del turno que queremos modificar.
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);

    const turnoDoc = await turnoRef.get();

    // 2. Doble chequeo de seguridad: nos aseguramos que el turno exista y que esté en el estado correcto.
    if (!turnoDoc.exists) {
      return { success: false, error: 'El turno que intentas modificar ya no existe.' };
    }
    if (turnoDoc.data().estado !== 'reprogramado') {
      return { success: false, error: 'Este turno no puede ser reprogramado en este momento.' };
    }

    // 3. Actualizamos el documento del turno con la nueva información.
    await turnoRef.update({
      fecha: new Date(nuevaFecha), // Guardamos la nueva fecha.
      estado: 'pendiente'         // Devolvemos el turno al estado 'pendiente' para que el admin lo confirme.
    });

    // 4. Revalidamos las rutas clave para que el cambio se refleje inmediatamente en la UI.
    revalidatePath('/turnos/mis-turnos'); // Actualiza la lista de turnos del usuario.
    revalidatePath('/admin/turnos');       // Actualiza el panel del administrador.

    console.log(`El turno ${turnoId} ha sido reprogramado exitosamente por el usuario ${userId}.`);

    return { success: true };

  } catch (error) {
    console.error(`Error crítico al reprogramar el turno ${turnoId} por el usuario:`, error);
    return { success: false, error: 'Ocurrió un error en el servidor. Por favor, intenta más tarde.' };
  }
}

/**
 * @action getTurnoDetailsForReprogramming
 * @description Obtiene los detalles esenciales de un turno para iniciar el proceso de reprogramación.
 * 
 * @param {object} params
 * @param {string} params.turnoId - El ID del documento del turno.
 * @param {string} params.userId - El ID del dueño de la mascota.
 * @param {string} params.mascotaId - El ID de la mascota.
 * @returns {Promise<{success: boolean, data?: {tipo: string, necesitaTraslado: boolean, mascota: object}, error?: string}>}
 */
export async function getTurnoDetailsForReprogramming({ turnoId, userId, mascotaId }) {
  if (!turnoId || !userId || !mascotaId) {
    return { success: false, error: 'Faltan datos para obtener los detalles del turno.' };
  }

  try {
    const db = admin.firestore();
    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);
    const turnoDoc = await turnoRef.get();

    if (!turnoDoc.exists) {
      return { success: false, error: 'No se encontró el turno especificado.' };
    }
    
    const mascotaRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId);
    const mascotaDoc = await mascotaRef.get();
     if (!mascotaDoc.exists) {
      return { success: false, error: 'No se encontró la mascota asociada al turno.' };
    }

    const turnoData = turnoDoc.data();
    const mascotaData = mascotaDoc.data();

    return {
      success: true,
      data: {
        tipo: turnoData.tipo,
        necesitaTraslado: turnoData.necesitaTraslado || false,
        mascota: {
            id: mascotaDoc.id,
            nombre: mascotaData.nombre,
            tamaño: mascotaData.tamaño
        }
      }
    };

  } catch (error) {
    console.error(`Error al obtener detalles del turno ${turnoId}:`, error);
    return { success: false, error: 'Error del servidor al buscar los detalles del turno.' };
  }
}


/**
 * @action getAvailableSlotsForReprogramming
 * @description Obtiene los horarios disponibles para un día, considerando tipo, cupos y traslado.
 * 
 * @param {object} params
 * @param {string} params.fecha - La fecha seleccionada en formato ISO (YYYY-MM-DD).
 * @param {string} params.tipo - 'clinica' o 'peluqueria'.
 * @param {boolean} params.necesitaTraslado - Si el turno original requería traslado.
 * @param {object} params.mascota - El objeto mascota, que debe contener 'tamaño'.
 * @returns {Promise<{success: boolean, data?: { horarios: Array<string> }, error?: string}>}
 */
export async function getAvailableSlotsForReprogramming({ fecha, tipo, necesitaTraslado, mascota }) {
    if (!fecha || !tipo || !mascota) {
        return { success: false, error: "Datos insuficientes para verificar la disponibilidad." };
    }

    try {
        const db = admin.firestore();
        const timeZone = 'America/Argentina/Buenos_Aires';
        const targetDate = dayjs.tz(fecha, timeZone);

        // 1. Verificación CRÍTICA de traslado ANTES de hacer cualquier otra cosa.
        if (necesitaTraslado) {
            const disponibilidadTraslado = await checkTrasladoAvailability({ fecha: targetDate.format('YYYY-MM-DD'), mascotas: [mascota] });
            if (!disponibilidadTraslado.disponible) {
                // Si no hay traslado, no devolvemos ningún horario.
                return { success: true, data: { horarios: [] }, error: "No hay espacio en el vehículo de traslado para este día." };
            }
        }

        // 2. Obtener los horarios ya ocupados para ese día y tipo de turno.
        const startOfDay = targetDate.startOf('day').toDate();
        const endOfDay = targetDate.endOf('day').toDate();

        const turnosSnapshot = await db.collectionGroup('turnos')
            .where('tipo', '==', tipo)
            .where('fecha', '>=', startOfDay)
            .where('fecha', '<=', endOfDay)
            .get();

        const horariosOcupados = turnosSnapshot.docs.map(doc => doc.data().horario);
        
        // 3. Calcular los horarios disponibles según el tipo de turno.
        let horariosDisponibles = [];
        if (tipo === 'clinica') {
            const todosLosHorarios = [];
            for (let h = 9; h < 18; h++) { // Horario de 9:00 a 17:30
                todosLosHorarios.push(`${h.toString().padStart(2, '0')}:00`);
                todosLosHorarios.push(`${h.toString().padStart(2, '0')}:30`);
            }
            horariosDisponibles = todosLosHorarios.filter(h => !horariosOcupados.includes(h));

        } else if (tipo === 'peluqueria') {
            const cuposPeluqueriaRef = db.collection('turnos_peluqueria').doc(targetDate.format('YYYY-MM-DD'));
            const cuposDoc = await cuposPeluqueriaRef.get();
            // Usamos 4 como valor por defecto si el documento del día no existe.
            const cuposData = cuposDoc.exists() ? cuposDoc.data() : { cuposManana: 4, cuposTarde: 4 };

            const countManana = horariosOcupados.filter(h => h === 'mañana').length;
            const countTarde = horariosOcupados.filter(h => h === 'tarde').length;
            
            if (cuposData.cuposManana > countManana) {
                horariosDisponibles.push('mañana');
            }
            if (cuposData.cuposTarde > countTarde) {
                horariosDisponibles.push('tarde');
            }
        }

        return { success: true, data: { horarios: horariosDisponibles } };

    } catch (error) {
        console.error(`Error al obtener horarios disponibles para ${fecha}:`, error);
        return { success: false, error: 'Error del servidor al calcular la disponibilidad.' };
    }
}