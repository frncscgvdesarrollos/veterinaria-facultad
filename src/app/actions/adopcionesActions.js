'use server';

import admin from '@/lib/firebaseAdmin';

/**
 * @function getMascotasEnAdopcion
 * @description Realiza una consulta de grupo para obtener todas las mascotas marcadas para adopción.
 *              Esta función está "blindada": si la consulta falla, registrará el error y devolverá un objeto de error.
 * @returns {Promise<Array<object>|object>} Un array de objetos de mascota o un objeto de error.
 */
export async function getMascotasEnAdopcion() {
  const firestore = admin.firestore();
  
  try {
    const mascotasGroup = firestore.collectionGroup('mascotas');
    // MODIFICACIÓN CLAVE: Añadimos .orderBy() para que coincida con el índice que creamos.
    const snapshot = await mascotasGroup
                          .where('enAdopcion', '==', true)
                          .orderBy('fechaNacimiento', 'desc') // Ordena por fecha de nacimiento, los más jóvenes primero.
                          .get();

    if (snapshot.empty) {
      return []; // No hay mascotas en adopción, devuelve un array vacío.
    }

    const mascotas = [];
    snapshot.forEach(doc => {
      mascotas.push({ 
        id: doc.id, 
        ...doc.data(),
        // Aseguramos que la fecha se pueda usar en el cliente
        fechaNacimiento: doc.data().fechaNacimiento?.toDate ? doc.data().fechaNacimiento.toDate().toISOString() : doc.data().fechaNacimiento,
      });
    });

    return mascotas;

  } catch (error) {
    // Esto es un "catch-all" para cualquier error inesperado.
    console.error("Error inesperado al obtener las mascotas en adopción:", error);

    // Devolvemos un objeto de error específico para que la UI pueda reaccionar.
    // El código FAILED_PRECONDITION suele indicar un problema de índice.
    if (error.code === 'FAILED_PRECONDITION') {
      return {
        error: 'La consulta requiere un índice compuesto. Por favor, genera el índice desde el enlace en la consola del servidor.',
        code: error.code
      };
    }

    return { 
      error: 'Ocurrió un error en el servidor al cargar las mascotas.',
      code: 'UNKNOWN'
    };
  }
}
