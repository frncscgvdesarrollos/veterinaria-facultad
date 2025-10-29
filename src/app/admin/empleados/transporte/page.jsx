import { getTurnsForTransporte } from '@/lib/actions/turnos.empleado.actions';
import { TransporteClientView } from './TransporteClientView'; // Importamos el nuevo componente cliente

// Este es un Server Component. Es async y obtiene los datos.
const TransportePage = async () => {
  // 1. Obtenemos los datos en el servidor
  const { data, error } = await getTurnsForTransporte();

  // 2. Manejamos los posibles errores
  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  // Podríamos mostrar un estado de carga aquí, pero Next.js ya maneja el streaming
  if (!data) {
    return <div className="p-8 text-white">Cargando turnos...</div>;
  }

  // 3. Renderizamos el Componente Cliente, pasándole los datos como props
  return <TransporteClientView recogidas={data.recogidas} entregas={data.entregas} />;
};

export default TransportePage;
