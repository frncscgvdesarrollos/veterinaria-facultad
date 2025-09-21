
'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();

export async function registrarMascota(user, mascotaData) {
  if (!user || !user.uid) {
    return { success: false, error: 'Usuario no autenticado.' };
  }

  const { nombre, especie, fechaNacimiento, sexo, enAdopcion } = mascotaData;
  if (!nombre || !especie || !fechaNacimiento || !sexo) {
    return { success: false, error: 'Faltan datos obligatorios de la mascota.' };
  }

  try {
    const mascotasCollection = firestore.collection('users').doc(user.uid).collection('mascotas');
    
    const nuevaMascota = {
      ...mascotaData,
      enAdopcion: enAdopcion || false,
      fechaNacimiento: new Date(fechaNacimiento),
      fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
      ownerId: user.uid, // Guardamos referencia al dueño
    };

    // Guardamos la mascota en la subcolección del usuario
    const mascotaRef = await mascotasCollection.add(nuevaMascota);

    // --- Estrategia de Desnormalización ---
    if (nuevaMascota.enAdopcion) {
      // Si está en adopción, creamos una copia en la colección principal `adopciones`
      const adopcionDoc = {
        ...nuevaMascota,
        mascotaId: mascotaRef.id, // Guardamos el ID original para referencia
        ownerName: user.displayName || 'Anónimo',
        ownerEmail: user.email,
      };
      // Usamos el mismo ID para facilitar la sincronización y eliminación
      await firestore.collection('adopciones').doc(mascotaRef.id).set(adopcionDoc);
    }

    // Revalidamos las páginas para que los cambios se reflejen
    revalidatePath('/mascotas');
    if (enAdopcion) {
        revalidatePath('/adopciones');
    }

    return { success: true };

  } catch (error) {
    console.error('Error al registrar la mascota:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al registrar la mascota.' };
  }
}
