'use client';

import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/app/components/Dashboard';
import LandingPage from '@/app/components/LandingPage';
import SubHeader from './components/SubHeader';
import { useEffect } from 'react';

export default function HomePage() {
    const { isLoggedIn, loading, user } = useAuth();

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
                <Dashboard />
            </>
        );
    }

    return <LandingPage />;
}
