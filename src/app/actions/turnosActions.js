
'use server';

import { revalidatePath } from 'next/cache';
import admin from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { getUserIdFromSession } from '@/lib/firebaseAdmin';

// --- Lógica para Turnos de Peluquería ---

const MAX_PERROS_GRANDES_POR_DIA = 2;
const MAX_TURNOS_POR_TURNO_PELUQUERIA = 8;

export async function solicitarTurnoPeluqueria(turnoData) {
    const { clienteId, mascotaId, fecha, turno, servicios, transporte, metodoPago } = turnoData;

    if (!clienteId || !mascotaId || !fecha || !turno || !metodoPago) {
        return { success: false, error: 'Faltan datos esenciales, incluido el método de pago.' };
    }

    const firestore = admin.firestore();

    try {
        const mascotaRef = firestore.collection('users').doc(clienteId).collection('mascotas').doc(mascotaId);
        const mascotaSnap = await mascotaRef.get();

        if (!mascotaSnap.exists) {
            return { success: false, error: 'La mascota seleccionada no existe.' };
        }
        const tamañoMascota = mascotaSnap.data().tamaño;

        const resultado = await firestore.runTransaction(async (transaction) => {
            const turnosRef = firestore.collection('turnos');

            if (tamañoMascota === 'grande') {
                const qGrandes = turnosRef.where('fecha', '==', fecha).where('tipo', '==', 'peluqueria').where('tamañoMascota', '==', 'grande').where('estado', 'in', ['pendiente', 'confirmado']);
                const snapGrandes = await transaction.get(qGrandes);
                if (snapGrandes.docs.length >= MAX_PERROS_GRANDES_POR_DIA) {
                    throw new Error('El cupo para perros grandes en esta fecha ya está completo.');
                }
            }
            const qTurno = turnosRef.where('fecha', '==', fecha).where('turno', '==', turno).where('tipo', '==', 'peluqueria').where('estado', 'in', ['pendiente', 'confirmado']);
            const snapTurno = await transaction.get(qTurno);
            if (snapTurno.docs.length >= MAX_TURNOS_POR_TURNO_PELUQUERIA) {
                throw new Error(`El turno de la ${turno} para esta fecha ya está completo.`);
            }

            const nuevoTurnoRef = firestore.collection('turnos').doc();
            transaction.set(nuevoTurnoRef, {
                ...turnoData,
                tamañoMascota,
                estado: 'pendiente',
                createdAt: new Date().toISOString(),
            });

            return { success: true, turnoId: nuevoTurnoRef.id };
        });

        revalidatePath('/admin/turnos');
        revalidatePath('/mis-turnos');
        return resultado;

    } catch (error) {
        console.error('Error en la transacción de solicitud de turno de peluquería:', error);
        return { success: false, error: error.message };
    }
}


// --- Lógica para Turnos de Consulta ---

export async function solicitarTurnoConsulta(turnoData) {
    // Añadimos 'metodoPago' a la desestructuración
    const { clienteId, mascotaId, fecha, turno, motivo, metodoPago } = turnoData;

    // Añadimos validación para el nuevo campo
    if (!clienteId || !mascotaId || !fecha || !turno || !motivo || !metodoPago) {
        return { success: false, error: 'Faltan datos esenciales, incluido el método de pago.' };
    }

    const firestore = admin.firestore();

    try {
        const nuevoTurnoRef = firestore.collection('turnos').doc();
        
        // El operador '...' se asegura de que 'metodoPago' se guarde en la BD
        await nuevoTurnoRef.set({
            ...turnoData,
            tipo: 'consulta',
            estado: 'pendiente',
            createdAt: new Date().toISOString(),
        });

        revalidatePath('/admin/turnos');
        revalidatePath('/mis-turnos');

        return { success: true, turnoId: nuevoTurnoRef.id };

    } catch (error) {
        console.error('Error al solicitar el turno de consulta:', error);
        return { success: false, error: 'Ocurrió un error inesperado al guardar la solicitud.' };
    }
}


// --- LÓGICA DE CANCELACIÓN DE TURNO (PARA USUARIOS) ---

export async function cancelarTurnoUsuario(turnoId) {
    const sessionCookie = cookies().get('__session')?.value || '';
    const userId = await getUserIdFromSession(sessionCookie);

    if (!userId) {
        return { success: false, error: 'No estás autenticado.' };
    }

    if (!turnoId) {
        return { success: false, error: 'No se proporcionó un ID de turno.' };
    }

    const firestore = admin.firestore();
    const turnoRef = firestore.collection('turnos').doc(turnoId);

    try {
        const turnoSnap = await turnoRef.get();

        if (!turnoSnap.exists) {
            return { success: false, error: 'El turno no existe.' };
        }

        const turnoData = turnoSnap.data();

        if (turnoData.clienteId !== userId) {
            return { success: false, error: 'No tienes permiso para cancelar este turno.' };
        }

        if ([ 'cancelado', 'completado'].includes(turnoData.estado)) {
            return { success: false, error: 'Este turno ya no se puede cancelar.' };
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaTurno = new Date(turnoData.fecha + 'T12:00:00'); 

        if (fechaTurno < hoy) {
            return { success: false, error: 'No se puede cancelar un turno que ya ha pasado.' };
        }

        await turnoRef.update({
            estado: 'cancelado',
            canceladoAt: new Date().toISOString(),
            canceladoPor: 'usuario'
        });

        revalidatePath('/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true };

    } catch (error) {
        console.error('Error al cancelar el turno:', error);
        return { success: false, error: 'Ocurrió un error inesperado al intentar cancelar el turno.' };
    }
}
