// Historia de Usuario 5: Gestión de Roles de Usuario
// Historia de Usuario 6: Completar Perfil de Usuario

'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';


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

/**
 * @function actualizarPerfil
 * @description Server Action para que un usuario actualice sus datos de perfil (con campos restringidos).
 * @param {string} userId - El ID del usuario.
 * @param {object} userData - Los datos del formulario.
 */
export async function actualizarPerfil(userId, userData) {
  const firestore = admin.firestore();


  const { 
    telefonoPrincipal, 
    telefonoSecundario, 
    direccion, 
    nombreContactoEmergencia, 
    telefonoContactoEmergencia 
  } = userData;
  
  // Se construye un objeto solo con los datos que se van a modificar.
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
    // Se actualiza el documento en Firestore solo con los campos permitidos.
    await firestore.collection('users').doc(userId).update(datosActualizables);

    revalidatePath('/mis-datos');
    
    // Devolvemos los datos actualizados para refrescar la UI correctamente.
    return { success: true, message: '¡Perfil actualizado con éxito!', updatedData: datosActualizables };

  } catch (error) {
    console.error('Error al actualizar el perfil en el servidor:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al actualizar tu perfil.' };
  }
}
