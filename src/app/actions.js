'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

// Definición de roles de la aplicación para evitar errores de referencia.
const aplicationRoles = {
  // Ejemplo: '12345678': 'admin'
};

/**
 * @function registerWithEmail
 * @description Server Action para registrar un nuevo usuario con email/contraseña y crear su perfil completo de una sola vez.
 * @param {object} userData - Datos del formulario de registro, incluyendo email, password, nombre, apellido, etc.
 */
export async function registerWithEmail(userData) {
  const { email, password, nombre, apellido, dni, telefonoPrincipal, telefonoSecundario, direccion, nombreContactoEmergencia, telefonoContactoEmergencia } = userData;

  if (!email || !password || !nombre || !apellido || !dni) {
    return { success: false, error: 'Faltan datos esenciales para el registro.' };
  }

  const auth = admin.auth();
  const firestore = admin.firestore();

  try {
    // 1. Crear el usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${nombre} ${apellido}`,
    });

    const userId = userRecord.uid;
    const userRole = aplicationRoles[dni] || 'dueño';

    // 2. Establecer el rol del usuario (custom claims)
    await auth.setCustomUserClaims(userId, { role: userRole });

    // 3. Crear el documento de perfil en Firestore
    await firestore.collection('users').doc(userId).set({
      nombre,
      apellido,
      dni,
      email, // Guardar email en Firestore para consultas más sencillas
      telefonoPrincipal,
      telefonoSecundario: telefonoSecundario || '',
      direccion,
      nombreContactoEmergencia,
      telefonoContactoEmergencia,
      role: userRole,
      profileCompleted: true, // El perfil está completo desde el principio
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    revalidatePath('/');
    
    // 4. Crear un token personalizado para que el cliente inicie sesión automáticamente
    const customToken = await auth.createCustomToken(userId);

    return { 
      success: true, 
      token: customToken,
      user: { // Devolvemos los datos del usuario para el estado local
        uid: userId, 
        email: userRecord.email, 
        role: userRole,
        profileCompleted: true
      } 
    };

  } catch (error) {
    console.error('Error en registerWithEmail:', error);
    if (error.code === 'auth/email-already-exists') {
      return { success: false, error: 'El correo electrónico ya está en uso.' };
    }
    return { success: false, error: 'Ocurrió un error en el servidor durante el registro.' };
  }
}

export async function completarPerfil(userId, userData) {
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

    // FIX: Asegurarse de que el displayName también se actualice en Auth
    await auth.updateUser(userId, {
        displayName: `${nombre} ${apellido}`
    });

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
    return { success: false, error: 'Ocurrió un error en el servidor.' };
  }
}

export async function agregarMascota(userId, mascotaData) {
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