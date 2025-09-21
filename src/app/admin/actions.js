
'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';

const firestore = admin.firestore();

/**
 * Confirma un turno pendiente.
 * @param {string} turnoId El ID del turno a confirmar.
 */
export async function confirmarTurno(turnoId) {
  if (!turnoId) {
    return { success: false, error: 'Se requiere el ID del turno.' };
  }

  try {
    const turnoRef = firestore.collection('turnos').doc(turnoId);
    await turnoRef.update({ estado: 'confirmado' });

    // Revalidamos tanto la página de admin como la de los turnos del usuario.
    revalidatePath('/admin/turnos');
    revalidatePath('/mis-turnos');

    return { success: true };
  } catch (error) {
    console.error('Error al confirmar el turno:', error);
    return { success: false, error: 'No se pudo actualizar el turno.' };
  }
}

/**
 * Cancela un turno pendiente o confirmado.
 * @param {string} turnoId El ID del turno a cancelar.
 */
export async function cancelarTurno(turnoId) {
  if (!turnoId) {
    return { success: false, error: 'Se requiere el ID del turno.' };
  }

  try {
    const turnoRef = firestore.collection('turnos').doc(turnoId);
    await turnoRef.update({ estado: 'cancelado' });

    // Revalidamos ambas páginas para que el cambio se refleje en todos lados.
    revalidatePath('/admin/turnos');
    revalidatePath('/mis-turnos');

    return { success: true };
  } catch (error) {
    console.error('Error al cancelar el turno:', error);
    return { success: false, error: 'No se pudo actualizar el turno.' };
  }
}
