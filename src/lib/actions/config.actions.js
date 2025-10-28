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



/**
 * @action obtenerConfiguracionServicios
 * @description Obtiene el estado de activación (activo/inactivo) de las categorías de servicios.
 * Lee los campos 'clinica_activa' y 'peluqueria_activa' del documento 'servicios' en la colección 'configuracion'.
 * @returns {Promise<{success: boolean, data?: {clinica_activa: boolean, peluqueria_activa: boolean}, error?: string}>} Un objeto con el estado de los servicios.
 */
export async function obtenerConfiguracionServicios() {
  try {
    const db = admin.firestore();
    const configRef = db.collection('configuracion').doc('servicios');
    const docSnap = await configRef.get();
    if (!docSnap.exists) {
      console.log("El documento 'servicios' no existe en 'configuracion'. Se retornan valores por defecto (false).");
      // Si no existe, se asume que los servicios están desactivados por seguridad.
      const defaultConfig = { clinica_activa: false, peluqueria_activa: false };
      return { success: true, data: defaultConfig };
    }
    
    const data = docSnap.data();
    // Nos aseguramos de devolver siempre un booleano para evitar errores en el cliente.
    const config = {
      clinica_activa: !!data.clinica_activa,
      peluqueria_activa: !!data.peluqueria_activa,
    };
    return { success: true, data: config };
  } catch (error) {
    console.error("Error en obtenerConfiguracionServicios:", error);
    return { success: false, error: 'No se pudo cargar la configuración de activación de servicios.' };
  }
}