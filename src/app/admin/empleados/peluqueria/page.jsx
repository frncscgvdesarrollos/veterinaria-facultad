// src/app/admin/empleados/peluqueria/page.jsx
// Este es un Server Component que se encarga de obtener los datos para la vista de peluquería.

import { getTurnsForPeluqueria } from '@/lib/actions/turnos.empleado.actions';
import PeluqueriaClientView from './PeluqueriaClientView';

const PeluqueriaPage = async () => {
  // 1. Obtenemos los turnos directamente en el servidor.
  const { data: turnos, error } = await getTurnsForPeluqueria();

  // 2. Manejamos un posible error durante la obtención de datos.
  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  // 3. Renderizamos el componente cliente, pasándole la lista completa de turnos.
  //    Si no hay datos, le pasamos un array vacío para evitar errores.
  return <PeluqueriaClientView initialTurnos={turnos || []} />;
};

export default PeluqueriaPage;
