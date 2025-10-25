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

    // CORRECCIÓN: .exists es una propiedad booleana en el Admin SDK del servidor, no una función.
    if (!docSnap.exists) {
      console.log("El documento 'disponibilidad' no existe en la colección 'configuracion'. Se retorna un array vacío.");
      return { success: true, data: [] };
    }

    const data = docSnap.data();
    const dateStrings = data.diasNoDisponibles || [];

    const dates = dateStrings.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    });
    
    return { success: true, data: dates };

  } catch (error) {
    console.error("Error definitivo en getDiasNoLaborales:", error);
    return { success: false, error: 'No se pudieron cargar las configuraciones de días festivos desde el servidor.' };
  }
}
