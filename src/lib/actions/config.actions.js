'use server';
import admin from '@/lib/firebaseAdmin';

/**
 * @action getDiasNoLaborales
 * @description Obtiene todos los días marcados como no laborales por un administrador.
 * Lee el array 'diasNoDisponibles' del documento 'disponibilidad' en la colección 'configuracion'.
 * @returns {Promise<{success: boolean, data?: Date[], error?: string}>} Un array de objetos Date correspondientes a los días bloqueados.
 */
export async function getDiasNoLaborales() {
  try {
    const db = admin.firestore();
    const configRef = db.collection('configuracion').doc('disponibilidad');
    const docSnap = await configRef.get();

    if (!docSnap.exists()) {
      // Si el documento no existe, no hay días para deshabilitar. No es un error.
      return { success: true, data: [] };
    }

    const data = docSnap.data();
    const dateStrings = data.diasNoDisponibles || [];

    // Convertimos los strings de fecha (YYYY-MM-DD) a objetos Date de JavaScript.
    // Es crucial crear las fechas en UTC para evitar problemas de zona horaria entre el servidor y el navegador.
    const dates = dateStrings.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // El mes en el constructor de Date es 0-indexado (Enero=0), por eso se resta 1.
      return new Date(Date.UTC(year, month - 1, day));
    });
    
    return { success: true, data: dates };

  } catch (error) {
    console.error("Error al obtener los días no laborales:", error);
    return { success: false, error: 'No se pudieron cargar los días no laborales desde el servidor.' };
  }
}
