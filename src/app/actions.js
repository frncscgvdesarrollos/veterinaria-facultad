// Historia de Usuario 5: Gestión de Roles de Usuario
// Historia de Usuario 6: Completar Perfil de Usuario

'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

// Mapa de roles de la aplicación. Mueve esto a un archivo de configuración si se vuelve más complejo.
const aplicationRoles = {
    '12345678': 'admin',
    '87654321': 'veterinario',
};

export async function completarPerfil(userId, userData) {
  // Verificación Crítica: ¿Está Firebase Admin inicializado?
  if (!admin.apps.length) {
    console.error('ERROR CRÍTICO: Firebase Admin SDK no está inicializado. Revisa las variables de entorno del servidor (e.g., en Vercel).');
    return { success: false, error: 'Error de configuración del servidor. No se pudo conectar a la base de datos.' };
  }

  const firestore = admin.firestore();
  const auth = admin.auth();
  const { 
    nombre, 
    apellido, 
    dni, 
    telefonoPrincipal, 
    telefonoSecundario, 
    direccion, 
    nombreContactoEmergencia, 
    telefonoContactoEmergencia 
  } = userData;
  
  if (!userId || !nombre || !apellido || !dni || !telefonoPrincipal || !direccion || !nombreContactoEmergencia || !telefonoContactoEmergencia) {
    return { success: false, error: 'Faltan datos esenciales para completar el perfil.' };
  }

  try {
    const userRole = aplicationRoles[dni] || 'dueño';
    await auth.setCustomUserClaims(userId, { role: userRole });

    await firestore.collection('users').doc(userId).set({
      nombre,
      apellido,
      dni,
      telefonoPrincipal,
      telefonoSecundario: telefonoSecundario || '',
      direccion,
      nombreContactoEmergencia,
      telefonoContactoEmergencia,
      role: userRole,
      profileCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    revalidatePath('/');
    return { success: true, role: userRole };

  } catch (error) {
    console.error('Error al completar el perfil:', error);
    // Ahora este error es más probable que sea un problema de lógica o permisos, no de conexión.
    return { success: false, error: 'Ocurrió un error al guardar los datos en el servidor.' };
  }
}

export async function agregarMascota(userId, mascotaData) {
    if (!admin.apps.length) {
        console.error('ERROR CRÍTICO: Firebase Admin SDK no está inicializado.');
        return { success: false, error: 'Error de configuración del servidor.' };
    }
    if (!userId) return { success: false, error: 'Usuario no autenticado.' };
    const { nombre, especie, raza, fechaNacimiento, tamaño, enAdopcion } = mascotaData;
    if (!nombre || !especie || !raza || !fechaNacimiento || !tamaño) {
        return { success: false, error: 'Todos los campos son obligatorios.' };
    }
    const firestore = admin.firestore();
    try {
        const mascotaRef = await firestore.collection('users').doc(userId).collection('mascotas').add({
            nombre, especie, raza, fechaNacimiento, tamaño,
            enAdopcion: enAdopcion || false, 
            createdAt: new Date(),
        });
        revalidatePath('/mascotas');
        return { success: true, mascotaId: mascotaRef.id };
    } catch (error) {
        console.error('Error al agregar la mascota:', error);
        return { success: false, error: 'No se pudo registrar la mascota.' };
    }
}

export async function actualizarPerfil(userId, userData) {
  if (!admin.apps.length) {
    console.error('ERROR CRÍTICO: Firebase Admin SDK no está inicializado.');
    return { success: false, error: 'Error de configuración del servidor.' };
  }

  const firestore = admin.firestore();
  const { 
    telefonoPrincipal, 
    telefonoSecundario, 
    direccion, 
    nombreContactoEmergencia, 
    telefonoContactoEmergencia 
  } = userData;
  
  const datosActualizables = {
    telefonoPrincipal,
    telefonoSecundario: telefonoSecundario || '',
    direccion,
    nombreContactoEmergencia,
    telefonoContactoEmergencia,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (!userId || !telefonoPrincipal || !direccion || !nombreContactoEmergencia || !telefonoContactoEmergencia) {
    return { success: false, error: 'Faltan datos esenciales para actualizar.' };
  }

  try {
    await firestore.collection('users').doc(userId).update(datosActualizables);
    revalidatePath('/mis-datos');
    return { success: true, message: '¡Perfil actualizado con éxito!', updatedData: datosActualizables };

  } catch (error) {
    console.error('Error al actualizar el perfil en el servidor:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al actualizar tu perfil.' };
  }
}
