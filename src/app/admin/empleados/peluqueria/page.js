import { getTurnsForPeluqueria } from '@/lib/actions/turnos.empleado.actions';
import PeluqueriaClientView from './PeluqueriaClientView';

// Este es un Server Component. Es async y obtiene los datos.
const PeluqueriaPage = async () => {
  // 1. Obtenemos los datos en el servidor
  const { data, error } = await getTurnsForPeluqueria();

  // 2. Manejamos los posibles errores
  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  // 3. Renderizamos el Componente Cliente, pasándole los datos como props
  return <PeluqueriaClientView initialTurnos={data || []} />;
};

export default PeluqueriaPage;
