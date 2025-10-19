'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

// Mapa para normalizar los tamaños de mascota a las claves de precios
const TAMAÑO_MAP = {
    'pequeño': 'chico',
    'mediano': 'mediano',
    'grande': 'grande',
};

export async function crearTurnosPeluqueria(user, turnosData) {
    const { 
        selectedMascotas, 
        serviciosPorMascota, 
        serviciosPeluqueria, 
        fecha,
        turnoHorario,
        necesitaTransporte,
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
                fecha: fecha,
                horario: turnoHorario, 
                tipo: 'peluqueria',
                mascotaId: mascota.id,
                mascotaNombre: mascota.nombre,
                servicioId: servicio.id,
                servicioNombre: servicio.nombre,
                precio: precio,
                necesitaTransporte: necesitaTransporte,
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
