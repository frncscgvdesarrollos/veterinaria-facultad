'use client'; // Convertimos la pÃ¡gina en un Componente de Cliente

import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/app/components/Dashboard';
import LandingPage from '@/app/components/LandingPage';
import SubHeader from './components/SubHeader';
import { useEffect } from 'react';

export default function HomePage() {
    const { isLoggedIn, loading, user } = useAuth(); // Usamos el hook para obtener el estado de auth

    // Mientras se estÃ¡ verificando el estado de autenticaciÃ³n, podemos mostrar un loader
    // para evitar un parpadeo entre la landing y el dashboard.
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }

    // Si el usuario estÃ¡ logueado, mostramos SubHeader y Dashboard.
    if (isLoggedIn) {
        return (
            <>
                <SubHeader />
                <Dashboard />
            </>
        );
    }

    // Si no estÃ¡ logueado, mostramos la Landing Page.
    return <LandingPage />;
}
