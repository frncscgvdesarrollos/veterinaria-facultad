'use server';

import admin from '@/lib/firebaseAdmin';

const db = admin.firestore();

// Función auxiliar para convertir Timestamps a un formato serializable (ISO string)
const safeToISOString = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  // Si ya es un string, lo devuelve. Si no, devuelve null para evitar errores.
  return (typeof timestamp === 'string') ? timestamp : null;
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
    return []; // Devolver array vacío en caso de error para no romper la UI
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
        // Convertir a ISO string para consistencia
        fechaNacimiento: safeToISOString(mascotaData.fechaNacimiento),
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
    const ownersCache = {}; // Cache para no buscar el mismo usuario varias veces

    for (const turnoDoc of turnosSnapshot.docs) {
      const turnoData = turnoDoc.data();
      
      // CORRECCIÓN: Usar el campo `clienteId` que es más robusto
      const userId = turnoData.clienteId;

      // Si no hay un clienteId en el turno, lo saltamos para evitar errores
      if (!userId) {
        console.warn(`Turno con ID ${turnoDoc.id} no tiene clienteId. Saltando...`);
        continue;
      }

      let ownerData;
      if (ownersCache[userId]) {
        ownerData = ownersCache[userId];
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          ownerData = userDoc.data();
          ownersCache[userId] = ownerData; // Guardar en cache
        } else {
          // Si el usuario no se encuentra, usamos datos por defecto
          ownerData = { nombre: 'Usuario Desconocido', apellido: '' };
        }
      }
      
      appointments.push({
        id: turnoDoc.id,
        ...turnoData,
        // CORRECCIÓN: Estandarizar la serialización de todas las fechas
        fecha: safeToISOString(turnoData.fecha),
        creadoEn: safeToISOString(turnoData.creadoEn),
        owner: {
          id: userId,
          nombre: ownerData.nombre,
          apellido: ownerData.apellido,
          email: ownerData.email,
        },
        // Incluimos los IDs originales para las acciones de admin
        userId: userId, 
        mascotaId: turnoData.mascotaId,
        turnoId: turnoDoc.id
      });
    }

    return appointments;

  } catch (error) {
    console.error("Error al obtener todos los turnos:", error);
    // CORRECIÓN: Devolver un array vacío para que la página no crashee
    return [];
  }
}
