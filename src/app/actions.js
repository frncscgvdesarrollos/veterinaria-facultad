// Historia de Usuario 5: Gestión de Roles de Usuario
// Historia de Usuario 6: Completar Perfil de Usuario

'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

/**
 * @constant aplicationRoles
 * @description Define roles especiales asignados a usuarios específicos según su DNI.
 * Esto centraliza la lógica de asignación de roles de administrador o empleado.
 * Corresponde a la "Historia de Usuario 5: Gestión de Roles de Usuario".
 */
const aplicationRoles = {
  '00000001': 'admin',      // Magali - DNI sin puntos
  '00000002': 'peluquera',
  '00000003': 'transporte',
};

/**
 * @function completarPerfil
 * @description Server Action para guardar los datos del perfil de un usuario y asignarle un rol.
 * Se ejecuta después de que un usuario se registra exitosamente.
 * Corresponde a las "Historias de Usuario 5 y 6".
 * @param {string} userId - El ID del usuario de Firebase Authentication.
 * @param {object} userData - Los datos del perfil del formulario.
 */
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
    barrio, 
    nombreContactoEmergencia, 
    telefonoContactoEmergencia 
  } = userData;
  
  if (!userId || !nombre || !apellido || !dni || !telefonoPrincipal || !direccion || !barrio || !nombreContactoEmergencia || !telefonoContactoEmergencia) {
    console.error('Validation failed. Missing data:', { userId, ...userData });
    return { success: false, error: 'Faltan datos esenciales para completar el perfil.' };
  }

  try {
    // 1. Asignación de Rol (HU 5)
    // Se verifica si el DNI del usuario corresponde a un rol especial.
    // Si no, se le asigna el rol 'dueño' por defecto.
    const userRole = aplicationRoles[dni] || 'dueño';

    // Se establece el "custom claim" en Firebase Authentication. Este token de rol
    // se usará en toda la app para controlar el acceso.
    await auth.setCustomUserClaims(userId, { role: userRole });

    // 2. Guardar Datos del Perfil en Firestore (HU 6)
    // Se almacenan los detalles del perfil en la colección 'users'.
    await firestore.collection('users').doc(userId).set({
      nombre,
      apellido,
      dni,
      telefonoPrincipal,
      telefonoSecundario: telefonoSecundario || '',
      direccion,
      barrio,
      nombreContactoEmergencia,
      telefonoContactoEmergencia,
      role: userRole,
      profileCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    revalidatePath('/');
    
    return { success: true, role: userRole };

  } catch (error) {
    console.error('Error al completar el perfil en el servidor:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al procesar tu perfil.' };
  }
}

/**
 * Server Action para agregar una nueva mascota a un usuario.
 */
export async function agregarMascota(userId, mascotaData) {
    if (!userId) {
        return { success: false, error: 'Usuario no autenticado.' };
    }

    const { nombre, especie, raza, fechaNacimiento, tamaño, enAdopcion } = mascotaData;

    if (!nombre || !especie || !raza || !fechaNacimiento || !tamaño) {
        return { success: false, error: 'Todos los campos, incluyendo el tamaño, son obligatorios.' };
    }

    const firestore = admin.firestore();

    try {
        const mascotaRef = await firestore.collection('users').doc(userId).collection('mascotas').add({
            nombre,
            especie,
            raza,
            fechaNacimiento,
            tamaño,
            enAdopcion: enAdopcion || false, 
            createdAt: new Date(),
        });

        revalidatePath('/mascotas');

        return { success: true, mascotaId: mascotaRef.id };

    } catch (error) {
        console.error('Error al agregar la mascota:', error);
        return { success: false, error: 'No se pudo registrar la mascota en la base de datos.' };
    }
}
