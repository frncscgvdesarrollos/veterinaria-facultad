// src/app/admin/empleados/transporte/page.jsx
// Este es un Server Component que se encarga de obtener los datos para la vista de transporte.

import { getTurnsForTransporte } from '@/lib/actions/turnos.empleado.actions';
import TransporteClientView from './TransporteClientView';

const TransportePage = async () => {
  // 1. Obtenemos la lista unificada de turnos desde la server action.
  const { data: turnos, error } = await getTurnsForTransporte();

  // 2. Manejamos un posible error durante la obtención de datos.
  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  // 3. Renderizamos el componente cliente, pasándole la lista completa de turnos.
  //    Si no hay datos, le pasamos un array vacío para evitar errores.
  return <TransporteClientView initialTurnos={turnos || []} />;
};

export default TransportePage;
