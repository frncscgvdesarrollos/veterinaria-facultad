// Este es ahora un Componente de Servidor. No necesita 'use client'.

import HomePageClient from './components/HomePageClient';
import GaleriaAdopciones from './components/GaleriaAdopciones'; // Componente de Servidor
import VistaTienda from './components/VistaTienda'; // Componente de Cliente (pero lo tratamos aquí)

export default function HomePage() {
  // Creamos un objeto con los componentes que queremos pasar al cliente
  const serverComponents = {
    galeria: <GaleriaAdopciones />,
    tienda: <VistaTienda />,
  };

  // Renderizamos el componente de cliente y le pasamos los componentes de servidor como props
  return <HomePageClient serverComponents={serverComponents} />;
}
