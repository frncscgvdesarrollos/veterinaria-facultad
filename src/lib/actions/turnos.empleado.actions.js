'use server';

import { revalidatePath } from 'next/cache';

// Placeholder for database interaction
async function updateTurnoInDatabase(turnoId, newStatus) {
  console.log(`Simulando: Actualizando turno ${turnoId} al estado ${newStatus}`);
  // Aquí iría la lógica real para actualizar Prisma, la base de datos, etc.
  // Por ahora, simplemente retornamos un éxito simulado.
  return { success: true, message: "Estado actualizado (simulado)." };
}

export async function updateEstadoDelTurno(turnoId, newStatus, userRole) {
  // TODO: Implementar lógica de permisos basada en userRole.
  // Por ejemplo:
  // if (userRole === 'peluqueria' && newStatus !== 'devolver') {
  //   return { success: false, error: "No tienes permiso para realizar esta acción." };
  // }

  console.log(`Recibida petición para cambiar turno ${turnoId} a ${newStatus} por rol ${userRole}`);

  try {
    const result = await updateTurnoInDatabase(turnoId, newStatus);
    
    if (result.success) {
      // Una vez que el estado cambia, necesitamos que las páginas que muestran
      // los turnos se actualicen. revalidatePath es la forma de Next.js de hacerlo.
      revalidatePath('/admin/turnos');
      revalidatePath('/admin/empleados/transporte');
      revalidatePath('/admin/empleados/peluqueria');
      return { success: true, message: '¡Estado del turno actualizado con éxito!' };
    } else {
      return { success: false, error: result.message };
    }

  } catch (error) {
    console.error('Error al actualizar el estado del turno:', error);
    return { success: false, error: 'Ocurrió un error en el servidor al intentar actualizar el estado.' };
  }
}
