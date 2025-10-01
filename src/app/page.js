
import HomePageClient from './components/HomePageClient';
import GaleriaAdopciones from './components/GaleriaAdopciones';
import VistaTienda from './components/VistaTienda';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Creamos un objeto para pasar los componentes del servidor al cliente.
  const serverComponents = {
    galeria: <GaleriaAdopciones />,
    tienda: <VistaTienda />
  };

  // Renderizamos el componente de cliente, que se encargará de la lógica de sesión.
  return <HomePageClient serverComponents={serverComponents} />;
}
