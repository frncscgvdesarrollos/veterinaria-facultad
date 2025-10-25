'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const db = admin.firestore();

export async function actualizarDiasNoLaborales({ nuevasFechas }) {
  if (!Array.isArray(nuevasFechas)) {
    return { success: false, error: 'El formato de los datos proporcionados es incorrecto.' };
  }

  // --- INICIO DE BLOQUE DE DEPURACIÓN MANUAL ---
  console.log("--- INICIANDO DEPURACIÓN MANUAL ---");
  const debugTurnoPath = 'usuarios/iTxgmrZ85tRCQWA9pyXRWiO2BzF3/mascotas/IjRZ1ckfrVRESOvBePQL/turnos/FIhaH41i2JDbOKBNSk8A';
  try {
    const debugTurnoDoc = await db.doc(debugTurnoPath).get();
    if (debugTurnoDoc.exists) {
      const data = debugTurnoDoc.data();
      console.log("DATOS DEL TURNO DE PRUEBA (lectura directa):");
      console.log(`- Estado: ${data.estado} (Tipo: ${typeof data.estado})`);
      // Verificamos si la fecha es un objeto Timestamp de Firestore
      if (data.fecha && typeof data.fecha.toDate === 'function') {
        console.log(`- Fecha (ISO String UTC): ${data.fecha.toDate().toISOString()}`);
      } else {
        console.log(`- ADVERTENCIA: El campo 'fecha' NO es un Timestamp de Firestore. Es de tipo: ${typeof data.fecha}`);
      }
    } else {
      console.log("Error de depuración: El turno de prueba NO se encontró en la ruta especificada.");
    }
  } catch (e) {
    console.error("Error fatal al leer el turno de prueba:", e);
  }
  console.log("--- FIN DE DEPURACIÓN MANUAL ---");
  // --- FIN DE BLOQUE DE DEPURACIÓN MANUAL ---

  const configRef = db.collection('configuracion').doc('disponibilidad');

  try {
    let reprogramadosCount = 0;

    await db.runTransaction(async (transaction) => {
      const configDoc = await transaction.get(configRef);
      const fechasAntiguas = configDoc.exists ? (configDoc.data().diasNoDisponibles || []) : [];
      
      // --- ¡CORRECCIÓN DE DUPLICADOS! ---
      // Se eliminan fechas duplicadas que vienen del cliente para asegurar datos limpios.
      const fechasUnicas = Array.from(new Set(nuevasFechas));
      console.log(`Fechas recibidas del cliente: ${nuevasFechas.length}. Fechas únicas a procesar: ${fechasUnicas.length}`);

      const fechasRecienBloqueadas = fechasUnicas.filter(fecha => !fechasAntiguas.includes(fecha));

      if (fechasRecienBloqueadas.length > 0) {
        console.log(`Días recién bloqueados detectados: ${fechasRecienBloqueadas.join(', ')}. Buscando turnos para reprogramar...`);

        for (const fechaStr of fechasRecienBloqueadas) {
            const startOfDay = new Date(`${fechaStr}T00:00:00.000Z`);
            const endOfDay = new Date(`${fechaStr}T23:59:59.999Z`);

            console.log(`Buscando turnos entre ${startOfDay.toISOString()} y ${endOfDay.toISOString()}`);

            const turnosAfectadosQuery = db.collectionGroup('turnos')
              .where('estado', 'in', ['pendiente', 'confirmado'])
              .where('fecha', '>=', startOfDay)
              .where('fecha', '<', endOfDay);
            
            const turnosAfectadosSnapshot = await turnosAfectadosQuery.get();
            
            if (turnosAfectadosSnapshot.empty) {
                console.log("La consulta no encontró ningún turno que cumpla los criterios.");
            } else {
              console.log(`¡ÉXITO! La consulta encontró ${turnosAfectadosSnapshot.size} turno(s).`);
              turnosAfectadosSnapshot.forEach(doc => {
                console.log(`Marcando para reprogramar: Turno ID ${doc.id}`);
                transaction.update(doc.ref, { estado: 'reprogramar' });
                reprogramadosCount++;
              });
            }
        }
      }
      // Se guarda la lista de fechas únicas en la base de datos
      transaction.set(configRef, { diasNoDisponibles: fechasUnicas }, { merge: true });
    });

    console.log(`Operación completada. Se han reprogramado un total de ${reprogramadosCount} turnos.`);

    // Revalidación para que el frontend se actualice
    revalidatePath('/admin/servicios');
    revalidatePath('/turnos/mis-turnos');
    revalidatePath('/admin/turnos');

    return { success: true, reprogramadosCount };

  } catch (error) {
    console.error("Error crítico al actualizar días no laborales:", error);
    return { success: false, error: `Error del servidor: ${error.message}` };
  }
}
