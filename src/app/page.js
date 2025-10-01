
import { getUserIdFromSession } from '@/lib/firebaseAdmin';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SubHeader from './components/SubHeader';
import GaleriaAdopciones from './components/GaleriaAdopciones';
import VistaTienda from './components/VistaTienda';


export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. Verificamos la sesión del usuario en el servidor.
  const userId = await getUserIdFromSession();

  if (userId) {
    return (
      <>
        <SubHeader />
        <Dashboard>
          {/* Sección de Adopciones */}
          <section className="py-12 md:py-16 px-4 md:px-8">
            <GaleriaAdopciones />
          </section>

          {/* Sección de la Tienda */}
          <section className="bg-slate-50 py-16 md:py-20">
            <div className="text-center mb-12 px-4">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestra Tienda</h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                Todo lo que necesitas para el cuidado y la felicidad de tu compañero.
              </p>
            </div>
            <div className="px-4 md:px-8">
              <VistaTienda />
            </div>
          </section>
        </Dashboard>
      </>
    );
  }

  return <LandingPage />;
}
