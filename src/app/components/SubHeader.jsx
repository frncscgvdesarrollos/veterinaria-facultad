'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SubHeader() {
    const pathname = usePathname();

    // Estilos para el enlace activo e inactivo
    const baseStyle = "px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200";
    const activeStyle = `${baseStyle} bg-gray-200 text-gray-900 font-semibold`;

    return (
        <nav className="bg-white shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    <div className="flex space-x-4">
                        {/* Se elimina el enlace a Inicio */}
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
            </div>
        </nav>
    );
}
