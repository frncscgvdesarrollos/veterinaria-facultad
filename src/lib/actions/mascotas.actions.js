'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

// La función registrarMascota no necesita cambios.
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
 * @description Obtiene todas las mascotas de un usuario, manejando de forma segura la posible ausencia de campos de fecha.
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
        const snapshot = await mascotasRef.orderBy('nombre', 'asc').get();

        if (snapshot.empty) {
            return { success: true, mascotas: [] };
        }

        const mascotas = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Comprobación de seguridad para las fechas
            // Si la fecha existe, la convierte a string. Si no, la deja como null.
            const fechaNacimiento = data.fechaNacimiento ? data.fechaNacimiento.toDate().toISOString().split('T')[0] : null;
            const fechaRegistro = data.fechaRegistro ? data.fechaRegistro.toDate().toISOString() : null;

            return {
                id: doc.id,
                ...data,
                fechaNacimiento, // Ahora es un string o null
                fechaRegistro, // Ahora es un string o null
            };
        });

        return { success: true, mascotas };

    } catch (error) {
        console.error('Error al obtener las mascotas del usuario:', error);
        // Si todavía hay un error, lo registramos para depurarlo.
        return { success: false, error: 'No se pudieron cargar las mascotas. Ocurrió un error inesperado al procesar los datos.' };
    }
}
