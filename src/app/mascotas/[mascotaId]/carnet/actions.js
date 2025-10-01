'use server';

import { db } from '@/lib/firebase';
import { collection, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

/**
 * Añade un nuevo registro al carnet sanitario de una mascota.
 */
export async function addCarnetEntry(userId, mascotaId, data) {
    if (!userId || !mascotaId) throw new Error("Faltan datos de autenticación.");

    const carnetRef = collection(db, 'users', userId, 'mascotas', mascotaId, 'carnetSanitario');
    await addDoc(carnetRef, {
        ...data,
        fechaCreacion: serverTimestamp(),
    });

    // Revalidamos la ruta para que Next.js la regenere con los nuevos datos.
    revalidatePath(`/mascotas/${mascotaId}/carnet`);
}

/**
 * Actualiza los datos de la ficha permanente de la mascota.
 */
export async function updateMascotaFicha(userId, mascotaId, data) {
    if (!userId || !mascotaId) throw new Error("Faltan datos de autenticación.");

    const mascotaRef = doc(db, 'users', userId, 'mascotas', mascotaId);
    await updateDoc(mascotaRef, data);
    
    revalidatePath(`/mascotas/${mascotaId}/carnet`);
}
