'use server'

import admin, { getUserIdFromSession } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function solicitarTurno(formData) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return { error: 'Debes iniciar sesión para solicitar un turno.' };
    }

    const { mascotaIds, mascotaId, fecha, hora, tipo, transporte } = formData;

    const ids = mascotaIds || [mascotaId];

    if (!ids || ids.length === 0 || !fecha || !hora || !tipo) {
        return { error: 'Faltan datos para procesar la solicitud.' };
    }

    try {
        const batch = firestore.batch();

        for (const id of ids) {
            const turnoRef = firestore.collection('turnos').doc();
            const turnoData = {
                usuarioId: userId,
                mascotaId: id,
                fecha,
                hora,
                tipo,
                estado: 'pendiente',
                creadoEn: new Date(),
            };

            if (transporte !== undefined) {
                turnoData.transporte = transporte;
            }
            
            batch.set(turnoRef, turnoData);
        }

        await batch.commit();

        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true };

    } catch (error) {
        console.error('Error al solicitar turno:', error);
        return { error: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.' };
    }
}

export async function cancelarTurnoUsuario(turnoId) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return { success: false, error: "Usuario no autenticado." };
    }

    if (!turnoId) {
        return { success: false, error: "ID de turno no proporcionado." };
    }

    const turnoRef = firestore.collection('turnos').doc(turnoId);

    try {
        const turnoDoc = await turnoRef.get();

        if (!turnoDoc.exists) {
            return { success: false, error: "El turno no existe." };
        }

        const turnoData = turnoDoc.data();

        if (turnoData.usuarioId !== userId) {
            return { success: false, error: "No tienes permiso para cancelar este turno." };
        }

        await turnoRef.update({ estado: 'cancelado' });

        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true, message: "Turno cancelado correctamente." };
    } catch (error) {
        console.error("Error al cancelar el turno:", error);
        return { success: false, error: "Ocurrió un error al cancelar el turno." };
    }
}

/**
 * Confirma un turno pendiente. (Función de Admin)
 * @param {string} turnoId El ID del turno a confirmar.
 */
export async function confirmarTurno(turnoId) {
  if (!turnoId) {
    return { success: false, error: 'Se requiere el ID del turno.' };
  }

  try {
    const turnoRef = firestore.collection('turnos').doc(turnoId);
    await turnoRef.update({ estado: 'confirmado' });

    revalidatePath('/admin/turnos');
    revalidatePath('/mis-turnos');

    return { success: true };
  } catch (error) {
    console.error('Error al confirmar el turno:', error);
    return { success: false, error: 'No se pudo actualizar el turno.' };
  }
}

/**
 * Cancela un turno pendiente o confirmado. (Función de Admin)
 * @param {string} turnoId El ID del turno a cancelar.
 */
export async function cancelarTurno(turnoId) {
  if (!turnoId) {
    return { success: false, error: 'Se requiere el ID del turno.' };
  }

  try {
    const turnoRef = firestore.collection('turnos').doc(turnoId);
    await turnoRef.update({ estado: 'cancelado' });

    revalidatePath('/admin/turnos');
    revalidatePath('/mis-turnos');

    return { success: true };
  } catch (error) {
    console.error('Error al cancelar el turno:', error);
    return { success: false, error: 'No se pudo actualizar el turno.' };
  }
}
