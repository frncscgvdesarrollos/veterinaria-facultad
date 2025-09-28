'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();

export async function registrarMascota(user, mascotaData) {
  if (!user || !user.uid) {
    return { success: false, error: 'Usuario no autenticado.' };
  }

  // Destructuramos los datos, incluyendo los nuevos campos del formulario mejorado
  const { nombre, especie, fechaNacimiento, sexo, tamaño, raza, enAdopcion } = mascotaData;

  // Validamos los campos más importantes que ahora vendrán de selects
  if (!nombre || !especie || !fechaNacimiento || !sexo || !tamaño || !raza) {
    return { success: false, error: 'Faltan datos obligatorios de la mascota.' };
  }

  try {
    const userMascotasCollection = firestore.collection('users').doc(user.uid).collection('mascotas');

    const nuevaMascotaData = {
      ...mascotaData,
      ownerId: user.uid,
      fechaNacimiento: new Date(fechaNacimiento),
      fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
      // Nos aseguramos de que enAdopcion sea un booleano
      enAdopcion: enAdopcion || false,
    };

    // 1. Guardamos la nueva mascota en la subcolección del usuario
    const mascotaRef = await userMascotasCollection.add(nuevaMascotaData);

    // 2. Creamos la subcolección 'carnetSanitario' para esta mascota
    const carnetSanitarioRef = mascotaRef.collection('carnetSanitario').doc('registro_inicial');
    await carnetSanitarioRef.set({
      vacunasAlDia: false, // Valor por defecto
      // Aquí se podrían añadir más campos iniciales en el futuro
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 3. Desnormalización: si la mascota está en adopción, la copiamos a una colección principal
    if (nuevaMascotaData.enAdopcion) {
      const adopcionDocData = {
        ...nuevaMascotaData,
        mascotaId: mascotaRef.id, // ID del documento original en la subcolección del usuario
        ownerName: user.displayName || 'Anónimo',
        ownerEmail: user.email,
        // Usamos el mismo ID para facilitar la gestión
      };
      await firestore.collection('adopciones').doc(mascotaRef.id).set(adopcionDocData);
    }
    
    // 4. Revalidamos las rutas para que los cambios se reflejen inmediatamente
    revalidatePath('/mascotas');
    if (enAdopcion) {
      revalidatePath('/adopciones');
    }

    return { success: true, message: 'Mascota registrada exitosamente.' };

  } catch (error) {
    console.error('Error al registrar la mascota:', error);
    return { success: false, error: 'Ocurrió un error en el servidor. Por favor, intenta de nuevo.' };
  }
}
