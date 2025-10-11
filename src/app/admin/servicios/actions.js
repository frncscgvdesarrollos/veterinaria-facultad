'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();
const PRECIOS_DOC_PATH = 'servicios/precios';

/**
 * Obtiene el documento de precios desde Firestore.
 * Si no existe, crea uno por defecto.
 * @returns {Promise<object>} El objeto con todos los precios.
 */
export async function obtenerPrecios() {
  try {
    const docRef = firestore.doc(PRECIOS_DOC_PATH);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data();
    } else {
      // Si el documento no existe, lo creamos con una estructura base.
      const defaultData = {
        peluqueria: [],
        clinica: [],
        medicamentos: [],
      };
      await docRef.set(defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error('Error al obtener los precios:', error);
    throw new Error('No se pudieron cargar los precios.');
  }
}

/**
 * Actualiza el documento completo de precios en Firestore.
 * @param {object} nuevosPrecios El objeto completo con las listas de precios actualizadas.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function actualizarPrecios(nuevosPrecios) {
  if (!nuevosPrecios || typeof nuevosPrecios !== 'object') {
    return { success: false, error: 'Datos de precios no válidos.' };
  }

  try {
    const docRef = firestore.doc(PRECIOS_DOC_PATH);
    await docRef.set(nuevosPrecios, { merge: true }); // Usamos merge por seguridad

    // Revalidamos la ruta para que los cambios se reflejen en la UI
    revalidatePath('/admin/servicios');

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar los precios:', error);
    return { success: false, error: 'No se pudieron guardar los cambios.' };
  }
}
