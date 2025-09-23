'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SubHeader() {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    if (loading || !user) {
        return null;
    }

    // Estilo base para los enlaces
    const baseStyle = "text-md font-semibold text-gray-600 hover:text-violet-800 transition-colors duration-200 pb-1";
    // Estilo para el enlace activo, con un borde inferior
    const activeStyle = "text-md font-semibold text-violet-800 border-b-2 border-violet-800 transition-colors duration-200 pb-1";

    return (
        <nav className="bg-white shadow-md border-t border-gray-200 w-full sticky top-24 z-40">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-center h-16 gap-x-8 md:gap-x-12">
                    {/* 1. BOTÓN PARA VOLVER AL ORIGEN (INICIO/DASHBOARD) */}
                    <Link href="/">
                        <span className={pathname === '/' ? activeStyle : baseStyle}>
                            Inicio
                        </span>
                    </Link>

                    <Link href="/mis-datos">
                        <span className={pathname === '/mis-datos' ? activeStyle : baseStyle}>
                            Mis Datos
                        </span>
                    </Link>
                    <Link href="/mascotas">
                       <span className={pathname === '/mascotas' ? activeStyle : baseStyle}>
                            Mis Mascotas
                       </span>
                    </Link>
                    <Link href="/mis-turnos">
                        <span className={pathname === '/mis-turnos' ? activeStyle : baseStyle}>
                            Mis Turnos
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
