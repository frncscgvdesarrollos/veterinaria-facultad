
'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import SubHeader from './SubHeader';
import Link from 'next/link';
import { FaStethoscope, FaCut } from 'react-icons/fa';

export default function HomePageClient({ serverComponents }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="loader border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
  }

  if (user) {
    return (
      <>
        <SubHeader />
        <Dashboard>
          {/* Sección de Turnos */}
          <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Gestionar Turnos</h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                Selecciona el servicio que necesitas para tu mascota.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card Consulta Veterinaria */}
              <Link href="/turnos/consulta" className="group block rounded-lg p-6 bg-gray-50 hover:bg-blue-100 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-500 rounded-lg text-white">
                    <FaStethoscope size={32} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-900">Consulta Veterinaria</h3>
                    <p className="mt-2 text-gray-600">Agenda una cita con nuestros veterinarios expertos.</p>
                  </div>
                </div>
              </Link>
              {/* Card Peluquería Canina */}
              <Link href="/turnos/peluqueria" className="group block rounded-lg p-6 bg-gray-50 hover:bg-green-100 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="p-4 bg-green-500 rounded-lg text-white">
                    <FaCut size={32} />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-900">Peluquería Canina</h3>
                    <p className="mt-2 text-gray-600">Un servicio completo de baño, corte y cuidado estético.</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Sección de Adopciones */}
          <section className="py-12 md:py-16 px-4 md:px-8">
            {serverComponents.galeria}
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
              {serverComponents.tienda}
            </div>
          </section>
        </Dashboard>
      </>
    );
  }

  return <LandingPage />;}
