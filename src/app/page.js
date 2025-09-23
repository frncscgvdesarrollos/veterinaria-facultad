// Este es ahora un Componente de Servidor. No necesita 'use client'.

import HomePageClient from './components/HomePageClient';
import GaleriaAdopciones from './components/GaleriaAdopciones'; // Componente de Servidor
import VistaTienda from './components/VistaTienda'; // Componente de Cliente (pero lo tratamos aquí)

export default function HomePage() {

  const serverComponents = {
    galeria: <GaleriaAdopciones />,
    tienda: <VistaTienda />,
  };

  
  return <HomePageClient serverComponents={serverComponents} />;
}
