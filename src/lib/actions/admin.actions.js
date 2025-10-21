'use server';

import { db } from '@/lib/firebaseAdmin';

export async function getAllUsers() {
  try {
    const usersSnapshot = await db.collection('users').get();
    if (usersSnapshot.empty) {
      return [];
    }
    
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return { error: "No se pudo cargar la lista de clientes." };
  }
}

export async function getUserByIdAndPets(userId) {
  if (!userId) {
    return { error: "ID de usuario no proporcionado." };
  }

  try {
    // Obtener datos del usuario
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return { error: "Cliente no encontrado." };
    }

    const userData = userDoc.data();

    // Obtener mascotas del usuario
    const mascotasSnapshot = await userDocRef.collection('mascotas').get();
    const mascotas = [];
    mascotasSnapshot.forEach(doc => {
      const mascotaData = doc.data();
      // Convertir Timestamps a strings para que sean serializables
      mascotas.push({
        id: doc.id,
        ...mascotaData,
        fechaNacimiento: mascotaData.fechaNacimiento ? mascotaData.fechaNacimiento.toDate().toLocaleDateString() : 'N/A',
        createdAt: mascotaData.createdAt ? mascotaData.createdAt.toDate().toISOString() : 'N/A',
      });
    });

    return {
      user: { id: userDoc.id, ...userData },
      mascotas: mascotas,
    };

  } catch (error) {
    console.error(`Error al obtener el usuario y sus mascotas (ID: ${userId}):`, error);
    return { error: "Ocurrió un error al cargar los datos del cliente." };
  }
}
