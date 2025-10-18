'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

/**
 * @function registrarMascota
 * @description Registra una nueva mascota en la subcolección de un usuario, convirtiendo la fecha de nacimiento a un Timestamp de Firestore.
 * @param {object} user - El objeto de usuario que contiene el uid.
 * @param {object} mascotaData - Los datos de la mascota a registrar.
 * @returns {Promise<object>} Un objeto indicando el éxito o el fracaso de la operación.
 */
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
 * @function getMascotasDelUsuario
 * @description Obtiene todas las mascotas de un usuario específico desde Firestore.
 * @param {object} user - El objeto de usuario que contiene el uid.
 * @returns {Promise<object>} Un objeto con la lista de mascotas o un error.
 */
export async function getMascotasDelUsuario(user) {
    if (!user || !user.uid) {
        return { success: false, error: "Usuario no autenticado." };
    }

    const firestore = admin.firestore();
    const mascotasRef = firestore.collection('users').doc(user.uid).collection('mascotas');

    try {
        const snapshot = await mascotasRef.orderBy('fechaRegistro', 'desc').get();

        if (snapshot.empty) {
            return { success: true, mascotas: [] };
        }

        const mascotas = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convertir Timestamps a string ISO para que sean serializables
            const fechaNacimiento = data.fechaNacimiento.toDate().toISOString().split('T')[0];
            const fechaRegistro = data.fechaRegistro.toDate().toISOString();

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
        return { success: false, error: 'No se pudieron cargar las mascotas.' };
    }
}
