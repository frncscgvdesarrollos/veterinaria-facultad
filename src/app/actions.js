
'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const aplicationRoles = {
  '00000001': 'admin',      // Magali - DNI sin puntos
  '00000002': 'peluquera',
  '00000003': 'transporte',
};

export async function completarPerfil(userId, userData) {
  const firestore = admin.firestore();
  const auth = admin.auth();

  // Campos que vienen del formulario de registro
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
  
  // Validación con los campos correctos
  if (!userId || !nombre || !apellido || !dni || !telefonoPrincipal || !direccion || !barrio || !nombreContactoEmergencia || !telefonoContactoEmergencia) {
    console.error('Validation failed. Missing data:', { userId, ...userData });
    return { success: false, error: 'Faltan datos esenciales para completar el perfil.' };
  }

  try {
    // Asignar rol. Si el DNI está en la lista, se le da un rol especial.
    const userRole = aplicationRoles[dni] || 'dueño';

    // 1. Asignar el "custom claim" para el rol de usuario en Authentication
    await auth.setCustomUserClaims(userId, { role: userRole });

    // 2. Guardar todos los datos del perfil en la base de datos Firestore
    await firestore.collection('users').doc(userId).set({
      nombre,
      apellido,
      dni,
      telefonoPrincipal,
      telefonoSecundario: telefonoSecundario || '', // Guardar aunque esté vacío
      direccion,
      barrio,
      nombreContactoEmergencia,
      telefonoContactoEmergencia,
      role: userRole,
      profileCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Buena práctica
    }, { merge: true }); // Merge true para no sobrescribir datos si ya existía el doc.

    // Invalidar caché para que los cambios se reflejen si es necesario
    revalidatePath('/');
    
    return { success: true, role: userRole };

  } catch (error) {
    console.error('Error al completar el perfil en el servidor:', error);
    // Devolver un error genérico para no exponer detalles de implementación
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
