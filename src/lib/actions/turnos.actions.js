'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { verificarDisponibilidadTraslado } from '../logica_traslado';

const firestore = admin.firestore();

// Mapa para normalizar los tamaños de mascota a las claves de precios
const TAMAÑO_MAP = {
    'pequeño': 'chico',
    'mediano': 'mediano',
    'grande': 'grande',
};

/**
 * Server Action para verificar la disponibilidad de horarios y traslado antes de confirmar.
 * Por ahora se enfoca en el traslado, asumiendo que la disponibilidad de horario de clínica
 * se valida principalmente en el cliente con una posterior verificación al crear el turno.
 */
export async function verificarDisponibilidadDeTurnosyTraslados({ fecha, nuevasMascotas }) {
    try {
        if (!fecha || !nuevasMascotas) {
            throw new Error('Faltan datos para la verificación del traslado.');
        }

        // Firestore necesita la fecha en formato YYYY-MM-DD para la consulta.
        // Aseguramos que la fecha que viene del cliente (que puede ser un objeto Date o un string) se formatea correctamente.
        const fechaObj = new Date(fecha);
        const fechaString = fechaObj.toISOString().split('T')[0];

        const turnosSnap = await firestore.collectionGroup('turnos')
            .where('fecha', '==', fechaString)
            .where('necesitaTraslado', '==', true)
            .get();

        // Extraemos los datos y nos aseguramos de que tengan el formato que espera la lógica de negocio
        const turnosDelDia = turnosSnap.docs.map(doc => ({
            mascota: { tamaño: doc.data().mascotaTamaño } 
        }));

        const hayDisponibilidad = verificarDisponibilidadTraslado(turnosDelDia, nuevasMascotas);

        if (!hayDisponibilidad) {
            return { success: false, error: 'No hay más lugar en el vehículo de traslado para la fecha seleccionada.' };
        }

        return { success: true };

    } catch (error) {
        console.error("Error al verificar disponibilidad de traslado:", error);
        return { success: false, error: error.message || 'No se pudo completar la verificación.' };
    }
}


export async function crearTurnosPeluqueria(user, turnosData) {
    const { 
        selectedMascotas, 
        serviciosPorMascota, 
        serviciosPeluqueria, 
        fecha,
        turnoHorario,
        necesitaTraslado, // Corregido de necesitaTransporte
        metodoPago
    } = turnosData;

    if (!user || !user.uid) {
        return { success: false, error: 'Usuario no autenticado.' };
    }

    const batch = firestore.batch();
    const turnosCreados = [];

    try {
        for (const mascota of selectedMascotas) {
            const servicioId = serviciosPorMascota[mascota.id];
            if (!servicioId) {
                throw new Error(`No se encontró servicio para ${mascota.nombre}`);
            }

            const servicio = serviciosPeluqueria.find(s => s.id === servicioId);
            if (!servicio) {
                throw new Error(`El servicio con ID ${servicioId} no es válido.`);
            }
            
            const tamañoNormalizado = TAMAÑO_MAP[mascota.tamaño.toLowerCase()];
            const precio = servicio.precios[tamañoNormalizado] || 0;

            const turnoRef = firestore.collection('users').doc(user.uid).collection('mascotas').doc(mascota.id).collection('turnos').doc();

            const nuevoTurno = {
                fecha: fecha, // Asegurarse que se guarde como YYYY-MM-DD
                horario: turnoHorario, 
                tipo: 'peluqueria',
                mascotaId: mascota.id,
                mascotaNombre: mascota.nombre,
                mascotaTamaño: mascota.tamaño, // ¡CAMBIO CLAVE! Guardamos el tamaño.
                servicioId: servicio.id,
                servicioNombre: servicio.nombre,
                precio: precio,
                necesitaTraslado: necesitaTraslado, // Corregido
                metodoPago: metodoPago,
                estado: 'pendiente', 
                creadoEn: new Date(),
            };

            batch.set(turnoRef, nuevoTurno);
            turnosCreados.push({ ...nuevoTurno, id: turnoRef.id });
        }

        await batch.commit();

        revalidatePath('/turnos');

        return { success: true, turnos: turnosCreados };

    } catch (error) {
        console.error("Error al crear turnos de peluquería:", error);
        return { success: false, error: error.message || 'Error al guardar los turnos en la base de datos.' };
    }
}

// ... (El resto de las funciones como confirmarTurno, cancelarTurno, etc. se mantienen igual)

export async function confirmarTurno(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }

    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'confirmado' });

        revalidatePath('/admin/turnos'); 

        return { success: true };
    } catch (error) {
        console.error("Error al confirmar el turno:", error);
        return { success: false, error: 'Error al actualizar el estado del turno.' };
    }
}

export async function cancelarTurno(turnoId) {
    if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }

    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'cancelado' });

        revalidatePath('/admin/turnos');

        return { success: true };
    } catch (error) {
        console.error("Error al cancelar el turno:", error);
        return { success: false, error: 'Error al actualizar el estado del turno.' };
    }
}

export async function cancelarTurnoUsuario(turnoId) {
     if (!turnoId) {
        return { success: false, error: 'ID de turno no proporcionado.' };
    }

    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update({ estado: 'cancelado' });

        revalidatePath('/turnos/mis-turnos');
        revalidatePath('/admin/turnos');

        return { success: true };
    } catch (error) {
        console.error("Error al cancelar el turno por el usuario:", error);
        return { success: false, error: 'Error al procesar la cancelación.' };
    }
}

export async function modificarTurno(turnoId, nuevosDatos) {
    if (!turnoId || !nuevosDatos) {
        return { success: false, error: 'Datos insuficientes para modificar el turno.' };
    }

    try {
        const turnoRef = firestore.collection('turnos').doc(turnoId);
        await turnoRef.update(nuevosDatos);

        revalidatePath('/admin/turnos');
        revalidatePath('/turnos/mis-turnos');

        return { success: true };
    } catch (error) {
        console.error("Error al modificar el turno:", error);
        return { success: false, error: 'Error al actualizar el turno en la base de datos.' };
    }
}
