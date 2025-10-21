'use server';

import admin from '@/lib/firebaseAdmin';

// Inicializa Firestore a partir de la instancia de admin importada
const db = admin.firestore();

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
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return { error: "Cliente no encontrado." };
    }

    const userData = userDoc.data();

    const mascotasSnapshot = await userDocRef.collection('mascotas').get();
    const mascotas = [];
    mascotasSnapshot.forEach(doc => {
      const mascotaData = doc.data();
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

export async function getAllAppointmentsWithDetails() {
  try {
    const turnosSnapshot = await db.collectionGroup('turnos').orderBy('fecha', 'desc').get();
    if (turnosSnapshot.empty) {
      return [];
    }

    const appointments = [];
    const ownersCache = {}; // Caché para no buscar el mismo dueño varias veces

    for (const turnoDoc of turnosSnapshot.docs) {
      const turnoData = turnoDoc.data();
      const turnoPath = turnoDoc.ref.path.split('/'); // users/{userId}/mascotas/{mascotaId}/turnos/{turnoId}
      const userId = turnoPath[1];

      let ownerData;
      if (ownersCache[userId]) {
        ownerData = ownersCache[userId];
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          ownerData = userDoc.data();
          ownersCache[userId] = ownerData; // Guardar en caché
        } else {
          ownerData = { nombre: 'Usuario no encontrado', apellido: '' };
        }
      }
      
      appointments.push({
        id: turnoDoc.id,
        ...turnoData,
        fecha: turnoData.fecha, // Ya está como string
        creadoEn: turnoData.creadoEn.toDate().toISOString(),
        owner: {
          id: userId,
          nombre: ownerData.nombre,
          apellido: ownerData.apellido,
          email: ownerData.email,
        },
      });
    }

    return appointments;

  } catch (error) {
    console.error("Error al obtener todos los turnos:", error);
    return { error: "No se pudo cargar la lista de turnos." };
  }
}
