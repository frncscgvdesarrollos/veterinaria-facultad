
import HomePageClient from './components/HomePageClient';
import GaleriaAdopciones from './components/GaleriaAdopciones';
import VistaTienda from './components/VistaTienda';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const serverComponents = {
    galeria: <GaleriaAdopciones />,
    tienda: <VistaTienda />
  };


  return <HomePageClient serverComponents={serverComponents} />;
}
