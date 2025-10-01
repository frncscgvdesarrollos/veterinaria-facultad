'use client';

import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/app/components/Dashboard';
import LandingPage from '@/app/components/LandingPage';
import SubHeader from './SubHeader';

export default function HomePageClient({ serverComponents }) {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }

    if (isLoggedIn) {
        return (
            <>
                <SubHeader />
                <Dashboard>
                    {/* Contenedor para la Galería de Adopciones con espaciado vertical y horizontal */}
                    <section className="py-12 md:py-16 px-4 md:px-8">
                        {serverComponents.galeria}
                    </section>

                    {/* Contenedor para la Tienda con espaciado, fondo y título */}
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

    return <LandingPage />;
}
