'use server';

import admin from '@/lib/firebaseAdmin';

const db = admin.firestore();

// Función auxiliar para convertir Timestamps de forma segura
const safeToLocaleDateString = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString();
  }
  // Si ya es un string o un valor no válido, lo devuelve o devuelve N/A
  return (typeof timestamp === 'string') ? timestamp : 'N/A'; 
};

const safeToISOString = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return (typeof timestamp === 'string') ? timestamp : 'N/A';
};

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
        fechaNacimiento: safeToLocaleDateString(mascotaData.fechaNacimiento),
        createdAt: safeToISOString(mascotaData.createdAt),
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
    const ownersCache = {};

    for (const turnoDoc of turnosSnapshot.docs) {
      const turnoData = turnoDoc.data();
      const turnoPath = turnoDoc.ref.path.split('/');
      const userId = turnoPath[1];

      let ownerData;
      if (ownersCache[userId]) {
        ownerData = ownersCache[userId];
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          ownerData = userDoc.data();
          ownersCache[userId] = ownerData;
        } else {
          ownerData = { nombre: 'Usuario no encontrado', apellido: '' };
        }
      }
      
      appointments.push({
        id: turnoDoc.id,
        ...turnoData,
        fecha: turnoData.fecha,
        creadoEn: safeToISOString(turnoData.creadoEn),
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
