'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const db = admin.firestore();

export async function getTurnsForAdminDashboard() {
  try {
    const timeZone = 'America/Argentina/Buenos_Aires';

    const turnosSnapshot = await db.collectionGroup('turnos')
                                 .orderBy('fecha', 'desc')
                                 .orderBy('tipo', 'asc')
                                 .get();

    if (turnosSnapshot.empty) {
      return { success: true, data: { hoy: [], proximos: [], finalizados: [] } };
    }

    const usersCache = new Map();
    const mascotasCache = new Map();

    const enrichedTurnosPromises = turnosSnapshot.docs.map(async (doc) => {
      const turnoData = doc.data();
      const userId = turnoData.clienteId;
      const mascotaId = turnoData.mascotaId;
      
      let user = { id: userId, nombre: 'Usuario', apellido: 'Eliminado', email: 'N/A' };
      let mascota = { id: mascotaId, nombre: 'Mascota Eliminada', especie: 'N/A' };

      if (userId) {
        if (usersCache.has(userId)) {
          user = usersCache.get(userId);
        } else {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            user = { id: userDoc.id, ...userDoc.data() };
            usersCache.set(userId, user);
          }
        }
      }
      
      if (userId && mascotaId) {
          const mascotaCacheKey = `${userId}-${mascotaId}`;
          if(mascotasCache.has(mascotaCacheKey)){
              mascota = mascotasCache.get(mascotaCacheKey);
          } else {
              const mascotaDoc = await db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).get();
              if(mascotaDoc.exists){
                  mascota = {id: mascotaDoc.id, ...mascotaDoc.data()};
                  mascotasCache.set(mascotaCacheKey, mascota);
              }
          }
      }

      // SOLUCIÓN DEFINITIVA: Construir un objeto explícito y serializable.
      // No usar `...turnoData` para evitar pasar Timestamps de Firestore al cliente.
      let fechaISO = null;
      if (turnoData.fecha && typeof turnoData.fecha.toDate === 'function') {
        fechaISO = turnoData.fecha.toDate().toISOString();
      }

      return {
        id: doc.id,
        userId: turnoData.clienteId,
        mascotaId: turnoData.mascotaId,
        tipo: turnoData.tipo,
        servicioNombre: turnoData.servicioNombre,
        estado: turnoData.estado,
        necesitaTraslado: turnoData.necesitaTraslado || false, // Asegurar valor por defecto
        fecha: fechaISO, // Enviar siempre un string ISO o null
        user: user,
        mascota: mascota,
      };
    });

    const enrichedTurnos = await Promise.all(enrichedTurnosPromises);

    const nowInArgentina = dayjs().tz(timeZone);
    const startOfTodayInArgentina = nowInArgentina.startOf('day');
    const endOfTodayInArgentina = nowInArgentina.endOf('day');

    const hoy = [];
    const proximos = [];
    const finalizados = [];

    for (const turno of enrichedTurnos) {
      // Filtrar turnos sin fecha válida que podrían causar errores
      if (!turno.fecha) continue;

      const fechaTurno = dayjs(turno.fecha);

      if (turno.estado === 'finalizado' || turno.estado === 'cancelado') {
        finalizados.push(turno);
      } else if (fechaTurno.isAfter(startOfTodayInArgentina) && fechaTurno.isBefore(endOfTodayInArgentina)) {
        hoy.push(turno);
      } else if (fechaTurno.isAfter(nowInArgentina) && (turno.estado === 'pendiente' || turno.estado === 'confirmado')) {
        proximos.push(turno);
      } else if (fechaTurno.isBefore(startOfTodayInArgentina) && (turno.estado === 'pendiente' || turno.estado === 'confirmado')) {
        finalizados.push(turno);
      } else {
        // Opcional: registrar turnos que no caen en ninguna categoría para depuración
        // console.log('Turno no clasificado:', turno);
      }
    }
    
    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    finalizados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    hoy.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return { 
      success: true, 
      data: { hoy, proximos, finalizados } 
    };

  } catch (error) {
    console.error("Error definitivo en getTurnsForAdminDashboard:", error);
    // Devolver un error claro que se mostrará en la UI
    return { success: false, error: `Error del servidor al procesar los datos: ${error.message}` };
  }
}

export async function updateTurnoStatus({ userId, mascotaId, turnoId, newStatus }) {
  try {
    if (!userId || !mascotaId || !turnoId || !newStatus) {
      throw new Error("Faltan parámetros requeridos para actualizar el turno.");
    }

    const turnoRef = db.collection('users').doc(userId).collection('mascotas').doc(mascotaId).collection('turnos').doc(turnoId);

    await turnoRef.update({ estado: newStatus });

    revalidatePath('/admin/turnos');

    return { success: true, message: `Turno actualizado a ${newStatus}.` };
  } catch (error) {
    console.error("Error en updateTurnoStatus:", error);
    return { success: false, error: `Error al actualizar el turno: ${error.message}` };
  }
}
