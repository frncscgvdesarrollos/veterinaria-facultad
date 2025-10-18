
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
