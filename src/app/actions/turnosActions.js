'use server'

import admin from '@/lib/firebaseAdmin';
import { getUserIdFromSession } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export async function solicitarTurno(formData) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return { error: 'Debes iniciar sesión para solicitar un turno.' };
    }

    const { mascotaIds, mascotaId, fecha, hora, tipo, transporte } = formData;

    // Lógica para manejar tanto un solo ID como un array de IDs
    const ids = mascotaIds || [mascotaId];

    if (!ids || ids.length === 0 || !fecha || !hora || !tipo) {
        return { error: 'Faltan datos para procesar la solicitud.' };
    }

    const firestore = admin.firestore();

    try {
        // Usamos un batch de escritura para asegurar que todas las operaciones se completen o ninguna lo haga.
        const batch = firestore.batch();

        for (const id of ids) {
            const turnoRef = firestore.collection('turnos').doc();
            const turnoData = {
                usuarioId: userId,
                mascotaId: id,
                fecha,
                hora,
                tipo,
                estado: 'pendiente', // Todos los turnos nuevos empiezan como pendientes
                creadoEn: new Date(),
            };

            // Añadir campo de transporte solo si es relevante
            if (transporte !== undefined) {
                turnoData.transporte = transporte;
            }
            
            batch.set(turnoRef, turnoData);
        }

        await batch.commit();

        revalidatePath('/mis-turnos');
        revalidatePath('/turnos/consulta');
        revalidatePath('/turnos/peluqueria');

        return { success: true };

    } catch (error) {
        console.error('Error al solicitar turno:', error);
        return { error: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.' };
    }
}
