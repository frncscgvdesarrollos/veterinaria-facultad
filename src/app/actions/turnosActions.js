'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

/**
 * @function cancelarTurnoUsuario
 * @description Un usuario cancela un turno que le pertenece.
 * @param {string} turnoId - El ID del documento del turno a cancelar.
 * @returns {Promise<object>} Un objeto indicando el éxito o el fracaso de la operación.
 */
export async function cancelarTurnoUsuario(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'No se proporcionó el ID del turno.' };
    }

    const firestore = admin.firestore();

    try {
        // Simplemente eliminamos el documento del turno de la colección principal 'turnos'
        await firestore.collection('turnos').doc(turnoId).delete();

        // Forzamos la revalidación de la página de turnos para que el cambio se vea al instante
        revalidatePath('/mis-turnos');

        return { success: true, message: 'El turno ha sido cancelado exitosamente.' };

    } catch (error) {
        console.error("Error al cancelar el turno:", error);
        return { success: false, error: 'Ocurrió un error en el servidor al intentar cancelar el turno.' };
    }
}
