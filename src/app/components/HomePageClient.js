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
                    {serverComponents.galeria}
                    {serverComponents.tienda}
                </Dashboard>
            </>
        );
    }

    // Si el usuario no está autenticado, mostrar la página de inicio de sesión
    return <LandingPage />;
}
