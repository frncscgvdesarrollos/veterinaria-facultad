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
    const snapshot = await firestore
                          .collectionGroup('mascotas')
                          .where('enAdopcion', '==', true)
                          .orderBy('fechaNacimiento', 'desc')
                          .get();

    if (snapshot.empty) {
      return [];
    }

    const mascotas = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir Timestamps a strings ISO para serialización
      const fechaNacimiento = data.fechaNacimiento?.toDate ? data.fechaNacimiento.toDate().toISOString() : null;
      const fechaRegistro = data.fechaRegistro?.toDate ? data.fechaRegistro.toDate().toISOString() : null;

      return {
        id: doc.id,
        path: doc.ref.path,
        ...data,
        fechaNacimiento,
        fechaRegistro,
      };
    });

    return mascotas;

  } catch (error) {
    console.error('Error inesperado al obtener las mascotas en adopción:', error);
    return [];
  }
}

/**
 * @function postularseParaAdopcion
 * @description Registra a un usuario como candidato para adoptar una mascota.
 * @param {string} mascotaPath - La ruta completa del documento de la mascota.
 * @param {object} datosUsuario - Los datos del usuario que se postula.
 */
export async function postularseParaAdopcion(mascotaPath, datosUsuario) {
  const firestore = admin.firestore();
  try {
    const mascotaRef = firestore.doc(mascotaPath);
    const candidatoRef = mascotaRef.collection('candidatos').doc(datosUsuario.uid);

    await candidatoRef.set({
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      fechaPostulacion: new Date(),
    });

    return { success: true, message: 'Te has postulado correctamente.' };
  } catch (error) {
    console.error('Error al postularse para adopción:', error);
    return { success: false, message: 'Hubo un error al procesar tu postulación.' };
  }
}
