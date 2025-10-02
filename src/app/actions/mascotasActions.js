'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

/**
 * @function registrarMascota
 * @description Registra una nueva mascota en la subcolección de un usuario y maneja la carga de imágenes a Firebase Storage.
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
        // Extraemos enAdopcion para usarlo después
        const { enAdopcion, ...dataToSave } = mascotaData;

        // 1. Añadimos la mascota a la subcolección del usuario.
        const mascotaRef = await userRef.collection('mascotas').add({
            ...dataToSave,
            enAdopcion: enAdopcion || false, // Aseguramos que el campo exista
            fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
        });

        // (Aquí iría la lógica de subida de fotos si la tuviéramos implementada con el Admin SDK)

        // 2. Revalidamos las rutas para que los cambios se reflejen inmediatamente.
        revalidatePath('/mis-mascotas');

        // 3. Si la mascota es para adopción, revalidamos TAMBIÉN la página de inicio y la de adopciones.
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
