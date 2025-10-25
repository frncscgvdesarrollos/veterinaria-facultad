'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const db = admin.firestore();

/**
 * @action actualizarDiasNoLaborales
 * @description Actualiza la lista de días no laborales y, crucialmente, actualiza el estado
 * de todos los turnos existentes que caen en los días recién bloqueados a 'reprogramar'.
 * Esta función es la autoridad central para manejar los cierres de días.
 * 
 * @param {{nuevasFechas: string[]}} params - Objeto que contiene las nuevas fechas a establecer.
 * @returns {Promise<{success: boolean, error?: string, reprogramadosCount?: number}>}
 */
export async function actualizarDiasNoLaborales({ nuevasFechas }) {
  // Validación inicial de los datos de entrada.
  if (!Array.isArray(nuevasFechas)) {
    return { success: false, error: 'El formato de los datos proporcionados es incorrecto.' };
  }

  const configRef = db.collection('configuracion').doc('disponibilidad');

  try {
    let reprogramadosCount = 0;

    // --- Inicia una transacción para garantizar la atomicidad de las operaciones ---
    await db.runTransaction(async (transaction) => {
      // 1. Obtener el estado actual de los días no laborales DENTRO de la transacción.
      const configDoc = await transaction.get(configRef);
      const fechasAntiguas = configDoc.exists ? (configDoc.data().diasNoDisponibles || []) : [];
      
      // 2. Identificar qué fechas son *nuevas* en la lista de bloqueo.
      const fechasRecienBloqueadas = nuevasFechas.filter(fecha => !fechasAntiguas.includes(fecha));

      if (fechasRecienBloqueadas.length > 0) {
        console.log(`Días recién bloqueados detectados: ${fechasRecienBloqueadas.join(', ')}. Buscando turnos para reprogramar...`);

        // 3. Crear y ejecutar la consulta de grupo para encontrar todos los turnos afectados.
        // Esta consulta requiere un índice compuesto en Firestore: turnos(estado ASC, fecha ASC)
        const turnosAfectadosQuery = db.collectionGroup('turnos')
          .where('fecha', 'in', fechasRecienBloqueadas)
          .where('estado', 'in', ['pendiente', 'confirmado']);
        
        const turnosAfectadosSnapshot = await turnosAfectadosQuery.get();

        if (!turnosAfectadosSnapshot.empty) {
          // 4. Si se encuentran turnos, actualizarlos a 'reprogramar' usando la transacción.
          turnosAfectadosSnapshot.forEach(doc => {
            console.log(`Marcando para reprogramar: Turno ID ${doc.id} en la fecha ${doc.data().fecha}`);
            transaction.update(doc.ref, { estado: 'reprogramar' });
          });
          reprogramadosCount = turnosAfectadosSnapshot.size;
        }
      }

      // 5. Finalmente, actualizar el documento de configuración con la nueva lista completa de fechas.
      transaction.set(configRef, { diasNoDisponibles: nuevasFechas }, { merge: true });
    });
    // --- Fin de la transacción ---

    console.log(`Operación completada. Se han reprogramado ${reprogramadosCount} turnos.`);

    // 6. Revalidar las rutas para que la UI se actualice en todas las partes relevantes de la aplicación.
    revalidatePath('/admin/configuracion'); // Actualiza el calendario del admin.
    revalidatePath('/turnos/nuevo');       // Actualiza la disponibilidad para nuevos turnos.
    revalidatePath('/turnos/mis-turnos'); // Importante: actualiza la vista de turnos del usuario.
    revalidatePath('/admin/turnos');         // Actualiza el dashboard del admin.

    return { success: true, reprogramadosCount };

  } catch (error) {
    console.error("Error crítico al actualizar días no laborales y reprogramar turnos:", error);
    // Error común si el índice de Firestore no ha sido creado todavía.
    if (error.message.includes('query requires an index')) {
      return {
        success: false,
        error: `Error de base de datos: La consulta para buscar turnos afectados requiere un índice en Firestore. Por favor, crea el índice y vuelve a intentarlo. Detalles del error: ${error.message}`
      };
    }
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}
