'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();
const serviciosRef = firestore.collection('servicios').doc('catalogo');
const configRef = firestore.collection('configuracion').doc('servicios');

const initialServiceData = { peluqueria: {}, clinica: {}, medicamentos: {} };
const initialConfigData = { peluqueria_activa: false, clinica_activa: false };

/**
 * Obtiene el objeto completo de servicios desde Firestore.
 * NUNCA LANZA ERROR. En caso de fallo, devuelve un objeto de servicios vacío.
 * @returns {Promise<object>} El objeto de servicios con todas las categorías.
 */
export async function obtenerServicios() {
    try {
        const doc = await serviciosRef.get();
        if (!doc.exists) {
            await serviciosRef.set(initialServiceData); // Crea el documento si no existe
            return initialServiceData;
        }
        return doc.data() || initialServiceData; // Devuelve datos o el objeto vacío si está corrupto
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        // CORRECCIÓN: Devolver un objeto vacío en lugar de lanzar error
        return initialServiceData;
    }
}

/**
 * Obtiene la configuración de activación de las categorías de servicio.
 * NUNCA LANZA ERROR. En caso de fallo, devuelve un objeto de configuración por defecto.
 * @returns {Promise<{peluqueria_activa: boolean, clinica_activa: boolean}>}
 */
export async function obtenerConfiguracionServicios() {
    try {
        const doc = await configRef.get();
        if (!doc.exists) {
            await configRef.set(initialConfigData); // Crea el documento si no existe
            return initialConfigData;
        }
        return doc.data() || initialConfigData; // Devuelve datos o el objeto por defecto si está corrupto
    } catch (error) {
        console.error("Error al obtener la configuración de servicios:", error);
        // CORRECCIÓN: Devolver una configuración por defecto en lugar de lanzar error
        return initialConfigData;
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
        const updateData = {};
        updateData[`${categoria}.${servicioId}`] = data;
        
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
