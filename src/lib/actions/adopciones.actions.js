'use server';

import admin from '@/lib/firebaseAdmin';

/**
 * @function getMascotasEnAdopcion
 * @description Obtiene todas las mascotas de todos los usuarios que están marcadas para adopción.
 * Utiliza una consulta de grupo de colecciones para buscar en todas las subcolecciones 'mascotas'.
 */
export async function getMascotasEnAdopcion() {
  const firestore = admin.firestore();
  try {
    // CORRECCIÓN FINAL: Se utiliza el campo 'fechaNacimiento' para ordenar, coincidiendo
    // con el índice compuesto que ya existe en Firestore.
    const snapshot = await firestore
                          .collectionGroup('mascotas')
                          .where('enAdopcion', '==', true)
                          .orderBy('fechaNacimiento', 'desc') // Usando el campo correcto del índice.
                          .get();

    if (snapshot.empty) {
      return []; // No hay mascotas en adopción, devuelve un array vacío.
    }

    const mascotas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return mascotas;

  } catch (error) {
    // Este error es importante para depuración en el servidor.
    console.error('Error inesperado al obtener las mascotas en adopción:', error);
    // Devuelve un array vacío para que la UI no se rompa en caso de error.
    return [];
  }
}
