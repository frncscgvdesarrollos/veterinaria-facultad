'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();
const preciosRef = firestore.collection('precios').doc('lista');

/**
 * Obtiene el objeto completo de servicios desde Firestore.
 * @returns {Promise<object>} El objeto de precios con todas las categorías.
 */
export async function obtenerServicios() {
    try {
        const doc = await preciosRef.get();
        if (!doc.exists) {
            // Si el documento no existe, lo inicializamos con una estructura vacía.
            const initialData = { peluqueria: {}, clinica: {}, medicamentos: {} };
            await preciosRef.set(initialData);
            return initialData;
        }
        return doc.data();
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        throw new Error('No se pudieron cargar los datos de los servicios.');
    }
}

/**
 * Guarda (añade o actualiza) un servicio específico en una categoría.
 * @param {string} categoria - La categoría del servicio (ej. 'peluqueria').
 * @param {string} servicioId - El ID único del servicio (ej. 'bano_corte_higienico').
 * @param {object} data - El objeto de datos del servicio a guardar.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function guardarServicio(categoria, servicioId, data) {
    try {
        const updateData = {};
        // Usamos notación de puntos para actualizar un campo anidado específico
        updateData[`${categoria}.${servicioId}`] = data;
        
        await preciosRef.update(updateData);

        revalidatePath('/admin/servicios');
        return { success: true };

    } catch (error) {
        console.error("Error al guardar el servicio:", error);
        return { success: false, error: 'No se pudo guardar el servicio.' };
    }
}

/**
 * Elimina un servicio específico de una categoría.
 * @param {string} categoria - La categoría del servicio.
 * @param {string} servicioId - El ID del servicio a eliminar.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function eliminarServicio(categoria, servicioId) {
    try {
        const FieldValue = admin.firestore.FieldValue;
        const updateData = {};
        updateData[`${categoria}.${servicioId}`] = FieldValue.delete();

        await preciosRef.update(updateData);

        revalidatePath('/admin/servicios');
        return { success: true };

    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        return { success: false, error: 'No se pudo eliminar el servicio.' };
    }
}

/**
 * Cambia el estado (activo/inactivo) de un servicio.
 * @param {string} categoria - La categoría del servicio ('peluqueria' o 'clinica').
 * @param {string} servicioId - El ID del servicio.
 * @param {boolean} estadoActual - El estado actual del servicio.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function toggleServicioActivo(categoria, servicioId, estadoActual) {
    try {
        const updateData = {};
        updateData[`${categoria}.${servicioId}.activo`] = !estadoActual;
        
        await preciosRef.update(updateData);
        
        revalidatePath('/admin/servicios');
        return { success: true };

    } catch (error) {
        console.error("Error al cambiar el estado del servicio:", error);
        return { success: false, error: 'No se pudo actualizar el estado.' };
    }
}
