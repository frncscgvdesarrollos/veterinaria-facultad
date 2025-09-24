
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
    // 1. OBTENER DATOS DEL DUEÑO DESDE FIRESTORE (Más robusto)
    const userDocRef = firestore.collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return { success: false, error: 'El perfil del usuario no existe.' };
    }
    const userData = userDoc.data();
    const ownerName = `${userData.nombre} ${userData.apellido}`;
    const ownerEmail = user.email; // El email viene del objeto de autenticación

    // 2. CONSTRUIR EL OBJETO DE LA MASCOTA (con los datos del dueño)
    const mascotasCollection = firestore.collection('users').doc(user.uid).collection('mascotas');
    
    const nuevaMascota = {
      ...mascotaData,
      enAdopcion: enAdopcion || false,
      fechaNacimiento: new Date(fechaNacimiento),
      // Usar 'createdAt' para coincidir con la consulta del cliente
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ownerId: user.uid,
      // Añadir la información del dueño directamente en el documento de la mascota
      ownerName: ownerName,
      ownerEmail: ownerEmail,
    };

    // 3. GUARDAR LA MASCOTA (Solo en la subcolección del usuario)
    await mascotasCollection.add(nuevaMascota);

    // 4. ELIMINADA LA LÓGICA DE DENORMALIZACIÓN
    // Ya no se necesita una copia en la colección 'adopciones'.

    // 5. REVALIDAR PATHS
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
