'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

// La función registrarMascota ya acepta el objeto user, la dejamos así por consistencia
// ya que se llama desde un formulario y no desde un useEffect.
export async function registrarMascota(user, mascotaData) {
    if (!user || !user.uid || !mascotaData) {
        return { success: false, error: "Faltan datos para el registro." };
    }

    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(user.uid);

    try {
        const { enAdopcion, fechaNacimiento, ...dataToSave } = mascotaData;
        const fechaNacimientoTimestamp = admin.firestore.Timestamp.fromDate(new Date(`${fechaNacimiento}T00:00:00`));

        const mascotaRef = await userRef.collection('mascotas').add({
            ...dataToSave,
            fechaNacimiento: fechaNacimientoTimestamp,
            enAdopcion: enAdopcion || false,
            fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
        });

        revalidatePath('/mis-mascotas');
        if (enAdopcion) {
            revalidatePath('/adopciones');
            revalidatePath('/');
        }

        return { success: true, message: '¡Mascota registrada exitosamente!', newMascotaId: mascotaRef.id };

    } catch (error) {
        console.error('Error al registrar la mascota:', error);
        return { success: false, error: 'Ocurrió un error en el servidor. Por favor, intenta de nuevo.' };
    }
}

/**
 * @function getMascotasDelUsuario - VERSIÓN CORREGIDA
 * @description Obtiene las mascotas de un usuario usando solo su UID.
 * @param {string} uid - El ID del usuario.
 * @returns {Promise<object>} Un objeto con la lista de mascotas o un error.
 */
export async function getMascotasDelUsuario(uid) {
    // 1. Aceptamos UID (string) en lugar de user (objeto)
    if (!uid) {
        return { success: false, error: "Usuario no autenticado." };
    }

    const firestore = admin.firestore();
    // 2. Usamos el UID directamente
    const mascotasRef = firestore.collection('users').doc(uid).collection('mascotas');

    try {
        const snapshot = await mascotasRef.orderBy('nombre', 'asc').get();

        if (snapshot.empty) {
            return { success: true, mascotas: [] };
        }

        const mascotas = snapshot.docs.map(doc => {
            const data = doc.data();
            
            const fechaNacimiento = data.fechaNacimiento ? data.fechaNacimiento.toDate().toISOString().split('T')[0] : null;
            const fechaRegistro = data.fechaRegistro ? data.fechaRegistro.toDate().toISOString() : null;

            return {
                id: doc.id,
                ...data,
                fechaNacimiento,
                fechaRegistro,
            };
        });

        return { success: true, mascotas };

    } catch (error) {
        console.error('Error al obtener las mascotas del usuario:', error);
        return { success: false, error: 'No se pudieron cargar las mascotas. Ocurrió un error inesperado al procesar los datos.' };
    }
}
