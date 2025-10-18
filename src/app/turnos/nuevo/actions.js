'use server';

import admin from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

// NOTA: No se usa el `db` del cliente, sino `admin.firestore()` para las operaciones de backend.

export async function getServiciosPorCategoria(categoria) {
  if (!['clinica', 'peluqueria'].includes(categoria)) {
    return { error: 'Categoría no válida.' };
  }

  const firestore = admin.firestore();
  try {
    const docRef = firestore.collection('servicios').doc('catalogo');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { error: 'No se encontraron servicios configurados.' };
    }

    const data = docSnap.data();
    const serviciosCategoria = data[categoria] || {};
    const serviciosArray = Object.entries(serviciosCategoria).map(([id, servicio]) => ({ id, ...servicio }));

    return { servicios: serviciosArray };

  } catch (error) {
    console.error('Error en getServiciosPorCategoria:', error);
    return { error: 'Ocurrió un error al cargar los servicios.' };
  }
}

export async function getHorariosDisponibles(fecha) {
  // Esta es una simulación. En un futuro, consultaría la colección `turnos` para el día dado.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simular latencia
  const horariosSimulados = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '15:00', '15:30', '16:00',
    '16:30', '17:00',
  ];
  return { horarios: horariosSimulados };
}

export async function registrarTurno(user, datosTurno) {
  if (!user || !user.uid) {
    return { success: false, error: "Usuario no autenticado." };
  }
  if (!datosTurno || !datosTurno.mascotas || datosTurno.mascotas.length === 0) {
    return { success: false, error: "Debe seleccionar al menos una mascota." };
  }

  const firestore = admin.firestore();
  try {
    const nuevoTurno = {
      userId: user.uid,
      mascotasIds: datosTurno.mascotas,
      categoria: datosTurno.categoria,
      servicioId: datosTurno.servicioId,
      servicioNombre: datosTurno.servicioNombre,
      estado: 'pendiente', // Estados: pendiente, confirmado, completado, cancelado
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (datosTurno.categoria === 'clinica') {
      nuevoTurno.fechaTurno = admin.firestore.Timestamp.fromDate(new Date(datosTurno.fecha));
      nuevoTurno.hora = datosTurno.hora;
    } else { // Peluquería
      nuevoTurno.bloqueTurno = datosTurno.bloqueTurno;
      nuevoTurno.conTraslado = datosTurno.conTraslado;
    }

    const turnoRef = await firestore.collection('turnos').add(nuevoTurno);

    // Revalidar la página de "mis turnos" para que el usuario vea su nuevo turno inmediatamente.
    revalidatePath('/mis-turnos');

    return { success: true, turnoId: turnoRef.id, message: "¡El turno se ha solicitado con éxito!" };

  } catch (error) {
    console.error('Error al registrar el turno:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al guardar el turno.' };
  }
}
