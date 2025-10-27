'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const aplicationRoles = {
  // Ejemplo: '12345678': 'admin'
};

export async function signInWithGoogle(idToken) {
  if (!idToken) {
    return { success: false, error: 'No se proporcionó un token de ID.' };
  }

  const auth = admin.auth();
  const firestore = admin.firestore();

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const displayName = decodedToken.name || '';

    const userDocRef = firestore.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    let userRole = 'dueño';
    let profileCompleted = false;

    if (userDoc.exists) {
      const userData = userDoc.data();
      userRole = userData.role || userRole;
      profileCompleted = userData.profileCompleted || false;
    } else {
      const [nombre, ...apellidoParts] = displayName.split(' ');
      const apellido = apellidoParts.join(' ');
      
      try {
        await auth.getUser(uid);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await auth.createUser({
            uid: uid,
            email: email,
            displayName: displayName
          });
        } else {
          throw error;
        }
      }

      await userDocRef.set({
        nombre: nombre || '',
        apellido: apellido || '',
        email: email,
        role: userRole,
        profileCompleted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      await auth.setCustomUserClaims(uid, { role: userRole });
    }

    const customToken = await auth.createCustomToken(uid);

    return {
      success: true,
      token: customToken,
      user: {
        uid,
        email,
        role: userRole,
        profileCompleted: profileCompleted
      }
    };

  } catch (error) {
    console.error('Error en signInWithGoogle:', error);
    if (error.code === 'auth/id-token-expired') {
        return { success: false, error: 'El token de sesión ha expirado. Por favor, inicia sesión de nuevo.' };
    }
    return { success: false, error: 'Ocurrió un error en el servidor durante el inicio de sesión con Google.' };
  }
}

export async function registerWithEmail(userData) {
  const { email, password, nombre, apellido, dni, telefonoPrincipal, telefonoSecundario, direccion, nombreContactoEmergencia, telefonoContactoEmergencia } = userData;

  if (!email || !password || !nombre || !apellido || !dni) {
    return { success: false, error: 'Faltan datos esenciales para el registro.' };
  }

  const auth = admin.auth();
  const firestore = admin.firestore();

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${nombre} ${apellido}`,
    });

    const userId = userRecord.uid;
    const userRole = aplicationRoles[dni] || 'dueño';

    await auth.setCustomUserClaims(userId, { role: userRole });

    await firestore.collection('users').doc(userId).set({
      nombre,
      apellido,
      dni,
      email,
      telefonoPrincipal,
      telefonoSecundario: telefonoSecundario || '',
      direccion,
      nombreContactoEmergencia,
      telefonoContactoEmergencia,
      role: userRole,
      profileCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    revalidatePath('/');
    
    const customToken = await auth.createCustomToken(userId);

    return { 
      success: true, 
      token: customToken,
      user: {
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
const validacionDatosCompletarPerfil = (data) => {
  const errors = {};
  const {
      nombre,
      apellido,
      dni,
      telefonoPrincipal,
      telefonoSecundario,
      direccion,
      nombreContactoEmergencia,
      telefonoContactoEmergencia
  } = data;

  if (!nombre || !nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  else if (!/^[a-zA-Z\s]+$/.test(nombre)) errors.nombre = 'El nombre solo puede contener letras.';

  if (!apellido || !apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
  else if (!/^[a-zA-Z\s]+$/.test(apellido)) errors.apellido = 'El apellido solo puede contener letras.';

  if (!dni || !dni.trim()) errors.dni = 'El DNI es obligatorio.';
  else if (!/^\d{7,8}$/.test(dni)) errors.dni = 'El DNI debe tener entre 7 y 8 números.';

  if (!direccion || !direccion.trim()) errors.direccion = 'La dirección es obligatoria.';

  if (!telefonoPrincipal || !telefonoPrincipal.trim()) errors.telefonoPrincipal = 'El teléfono principal es obligatorio.';
  else if (!/^\d{10,15}$/.test(telefonoPrincipal)) errors.telefonoPrincipal = 'El teléfono debe tener entre 10 y 15 números.';

  if (telefonoSecundario && telefonoSecundario.trim() && !/^\d{10,15}$/.test(telefonoSecundario)) {
      errors.telefonoSecundario = 'Si se ingresa, el teléfono debe tener entre 10 y 15 números.';
  }

  if (!nombreContactoEmergencia || !nombreContactoEmergencia.trim()) errors.nombreContactoEmergencia = 'El nombre del contacto de emergencia es obligatorio.';
  else if (!/^[a-zA-Z\s]+$/.test(nombreContactoEmergencia)) errors.nombreContactoEmergencia = 'El nombre del contacto de emergencia solo puede contener letras.';

  if (!telefonoContactoEmergencia || !telefonoContactoEmergencia.trim()) errors.telefonoContactoEmergencia = 'El teléfono de emergencia es obligatorio.';
  else if (!/^\d{10,15}$/.test(telefonoContactoEmergencia)) errors.telefonoContactoEmergencia = 'El teléfono de emergencia debe tener entre 10 y 15 números.';

  return errors;
};

export async function completarPerfil(userId, userData) {
  // 1. Validar los datos como primer paso en el servidor
  const validationErrors = validacionDatosCompletarPerfil(userData);
  const errorValues = Object.values(validationErrors);

  if (errorValues.length > 0) {
    // Si hay errores, unirlos en un solo string y devolver el mensaje.
    const errorMessage = errorValues.join(' ');
    return { success: false, error: errorMessage };
  }

  // Si la validación pasa, continuar con la lógica existente
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
  
  if (!userId) {
    return { success: false, error: 'Error de autenticación: Falta el ID de usuario.' };
  }

  try {
    const userRole = aplicationRoles[dni] || 'dueño';

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
    return { success: false, error: 'Ocurrió un error en el servidor al guardar el perfil.' };
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
