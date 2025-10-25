'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const db = admin.firestore();

/**
 * @action actualizarDiasNoLaborales
 * @description (CORREGIDO) Actualiza la lista de días no laborales y actualiza el estado de los turnos
 * afectados a 'reprogramar'. Ahora busca turnos dentro de un rango de tiempo para el día bloqueado.
 * 
 * @param {{nuevasFechas: string[]}} params - Objeto que contiene las nuevas fechas a establecer (formato YYYY-MM-DD).
 * @returns {Promise<{success: boolean, error?: string, reprogramadosCount?: number}>}
 */
export async function actualizarDiasNoLaborales({ nuevasFechas }) {
  if (!Array.isArray(nuevasFechas)) {
    return { success: false, error: 'El formato de los datos proporcionados es incorrecto.' };
  }

  const configRef = db.collection('configuracion').doc('disponibilidad');

  try {
    let reprogramadosCount = 0;

    await db.runTransaction(async (transaction) => {
      const configDoc = await transaction.get(configRef);
      const fechasAntiguas = configDoc.exists ? (configDoc.data().diasNoDisponibles || []) : [];
      const fechasRecienBloqueadas = nuevasFechas.filter(fecha => !fechasAntiguas.includes(fecha));

      if (fechasRecienBloqueadas.length > 0) {
        console.log(`Días recién bloqueados detectados: ${fechasRecienBloqueadas.join(', ')}. Buscando turnos para reprogramar...`);

        // Para cada día recién bloqueado, ejecutamos una consulta de rango.
        for (const fechaStr of fechasRecienBloqueadas) {
            // 1. Crear el rango de Timestamps para todo el día (en UTC para consistencia)
            const startOfDay = new Date(`${fechaStr}T00:00:00.000Z`);
            const endOfDay = new Date(`${fechaStr}T23:59:59.999Z`);

            console.log(`Buscando turnos entre ${startOfDay.toISOString()} y ${endOfDay.toISOString()}`);

            // 2. Consulta para encontrar turnos en el rango de fecha y con estado válido.
            // Firestore requiere un índice para esta consulta: collectionGroup('turnos'), estado ASC, fecha ASC
            const turnosAfectadosQuery = db.collectionGroup('turnos')
              .where('estado', 'in', ['pendiente', 'confirmado'])
              .where('fecha', '>=', startOfDay)
              .where('fecha', '<', endOfDay);
            
            const turnosAfectadosSnapshot = await turnosAfectadosQuery.get();
            
            if (!turnosAfectadosSnapshot.empty) {
              // 3. Actualizar cada turno encontrado dentro de la transacción.
              turnosAfectadosSnapshot.forEach(doc => {
                console.log(`Marcando para reprogramar: Turno ID ${doc.id} en fecha ${doc.data().fecha.toDate().toISOString()}`);
                transaction.update(doc.ref, { estado: 'reprogramar' });
                reprogramadosCount++;
              });
            }
        }
      }

      // 4. Actualizar el documento de configuración con la lista completa de fechas.
      transaction.set(configRef, { diasNoDisponibles: nuevasFechas }, { merge: true });
    });

    console.log(`Operación completada. Se han reprogramado un total de ${reprogramadosCount} turnos.`);

    // 5. Revalidar todas las rutas relevantes para que la UI se actualice.
    revalidatePath('/admin/servicios'); // Contiene el DisponibilidadCalendario
    revalidatePath('/admin/configuracion'); // Ruta antigua, por si acaso
    revalidatePath('/turnos/nuevo');
    revalidatePath('/turnos/mis-turnos');
    revalidatePath('/admin/turnos');

    return { success: true, reprogramadosCount };

  } catch (error) {
    console.error("Error crítico al actualizar días no laborales:", error);
    if (error.message.includes('query requires an index')) {
      return {
        success: false,
        error: `Error de base de datos: La consulta necesita un índice en Firestore. Por favor, crea un índice compuesto para la colección 'turnos' con los campos 'estado' (ascendente) y 'fecha' (ascendente).`
      };
    }
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}
