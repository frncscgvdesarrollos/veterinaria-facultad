'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();
const serviciosRef = firestore.collection('servicios').doc('catalogo');
const configRef = firestore.collection('configuracion').doc('servicios');

/**
 * Obtiene el objeto completo de servicios desde Firestore.
 * @returns {Promise<object>} El objeto de servicios con todas las categorías.
 */
export async function obtenerServicios() {
    try {
        const doc = await serviciosRef.get();
        if (!doc.exists) {
            const initialData = { peluqueria: {}, clinica: {}, medicamentos: {} };
            await serviciosRef.set(initialData);
            return initialData;
        }
        return doc.data();
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        throw new Error('No se pudieron cargar los datos de los servicios.');
    }
}

/**
 * Obtiene la configuración de activación de las categorías de servicio.
 * @returns {Promise<{peluqueria_activa: boolean, clinica_activa: boolean}>}
 */
export async function obtenerConfiguracionServicios() {
    try {
        const doc = await configRef.get();
        if (!doc.exists) {
            const initialData = { peluqueria_activa: true, clinica_activa: true };
            await configRef.set(initialData);
            return initialData;
        }
        return doc.data();
    } catch (error) {
        console.error("Error al obtener la configuración de servicios:", error);
        throw new Error('No se pudo cargar la configuración.');
    }
}

/**
 * Cambia el estado de activación de una categoría completa (Peluquería o Clínica).
 * @param {'peluqueria' | 'clinica'} categoria La categoría a modificar.
 * @param {boolean} estadoActual El estado actual de la categoría.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function toggleCategoriaActiva(categoria, estadoActual) {
    try {
        const campo = `${categoria}_activa`; // ej. peluqueria_activa
        await configRef.update({ [campo]: !estadoActual });

        // Revalidar los paths para que el cambio se refleje inmediatamente en la UI
        revalidatePath('/admin/servicios');
        revalidatePath('/turnos/nuevo');

        return { success: true };
    } catch (error) {
        console.error(`Error al cambiar estado de ${categoria}:`, error);
        return { success: false, error: 'No se pudo actualizar el estado de la categoría.' };
    }
}

/**
 * Guarda (añade o actualiza) un servicio específico en una categoría.
 * @param {string} categoria - La categoría del servicio (ej. 'peluqueria').
 * @param {string} servicioId - El ID único del servicio.
 * @param {object} data - El objeto de datos del servicio.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function guardarServicio(categoria, servicioId, data) {
    try {
        const { activo, ...restData } = data;
        const updateData = {};
        updateData[`${categoria}.${servicioId}`] = restData;
        
        await serviciosRef.update(updateData);

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

        await serviciosRef.update(updateData);

        revalidatePath('/admin/servicios');
        return { success: true };

    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        return { success: false, error: 'No se pudo eliminar el servicio.' };
    }
}
