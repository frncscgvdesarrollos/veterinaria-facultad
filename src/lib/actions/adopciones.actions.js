'use server';

import admin from '@/lib/firebaseAdmin';

// ... (la función getMascotasEnAdopcion se mantiene igual)
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
  // 1. Añadimos validación de entrada
  if (!mascotaPath || typeof mascotaPath !== 'string') {
    console.error('Error de validación: La ruta de la mascota no es válida.', mascotaPath);
    return { success: false, message: 'Error: La referencia a la mascota no es válida.' };
  }
  if (!datosUsuario || !datosUsuario.uid) {
    console.error('Error de validación: Los datos del usuario no son válidos o falta el UID.', datosUsuario);
    return { success: false, message: 'Error: La información del usuario no es válida.' };
  }

  const firestore = admin.firestore();
  try {
    const mascotaRef = firestore.doc(mascotaPath);
    const candidatoRef = mascotaRef.collection('candidatos').doc(datosUsuario.uid);

    // 2. Verificamos si ya existe una postulación para evitar duplicados
    const docSnap = await candidatoRef.get();
    if (docSnap.exists) {
        return { success: false, message: 'Ya te has postulado para esta mascota.' };
    }

    // 3. Creamos la nueva postulación
    await candidatoRef.set({
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      fechaPostulacion: new Date(), // Usar la hora del servidor
    });

    return { success: true, message: '¡Postulación enviada con éxito! El dueño se pondrá en contacto contigo.' };

  } catch (error) {
    console.error('Error al procesar la postulación en Firestore:', error);
    return { success: false, message: 'No se pudo procesar tu postulación en este momento. Inténtalo de nuevo más tarde.' };
  }
}
