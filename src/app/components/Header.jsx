'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const cerrarsesion = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    let displayIdentifier = 'Usuario';
    if (user) {
        if (user.displayName && user.displayName !== 'Sin Nombre') {
            displayIdentifier = user.displayName.split(' ')[0];
        } else if (user.email) {
            displayIdentifier = user.email.split('@')[0];
        }
    }

    const RoleSpecificLink = ({ isMobile }) => {
        const baseClasses = isMobile 
            ? "flex items-center gap-3 text-md font-bold text-violet-700 p-3 rounded-md bg-violet-50 hover:bg-violet-100"
            : "text-md font-semibold text-violet-700 hover:text-violet-900 transition-colors";

        if (!user || !user.role) return null;

        switch (user.role) {
            case 'admin':
                return <Link href="/admin" className={baseClasses}>{isMobile && <FaUserShield />}Panel Admin</Link>;
            case 'peluqueria':
                return <Link href="/admin/empleados/peluqueria" className={baseClasses}>{isMobile && <FaUserShield />}Portal Peluquería</Link>;
            case 'transporte':
                return <Link href="/admin/empleados/transporte" className={baseClasses}>{isMobile && <FaUserShield />}Portal Transporte</Link>;
            default:
                return null;
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 w-full">
            <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    <div className="flex-shrink-0">
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>
                            <Image 
                                src="/LOGO.svg" 
                                alt="Logo Veterinaria Magali Martin"
                                width={180}
                                height={50}
                                priority
                            />
                        </Link>
                    </div>
                    
                    {isLoggedIn && (
                         <div className="hidden md:flex items-center gap-8">
                            <RoleSpecificLink isMobile={false} />
                            <Link href="/mis-datos" className="text-md font-medium text-gray-600 hover:text-violet-700 transition-colors">Mis Datos</Link>
                            <Link href="/mascotas" className="text-md font-medium text-gray-600 hover:text-violet-700 transition-colors">Mis Mascotas</Link>
                            <Link href="/turnos/mis-turnos" className="text-md font-medium text-gray-600 hover:text-violet-700 transition-colors">Mis Turnos</Link>
                         </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        {isLoggedIn && user ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700 capitalize">Hola, {displayIdentifier}</span>
                                    <div className="flex items-center justify-center bg-violet-100 rounded-full h-11 w-11 text-violet-700 font-bold text-lg overflow-hidden">
                                        {user.photoURL ? (
                                            <Image src={user.photoURL} alt="Avatar" width={44} height={44} />
                                        ) : (
                                            <span>{getInitial(displayIdentifier)}</span>
                                        )}
                                    </div>
                                </div>

                                <button onClick={cerrarsesion} className="hidden md:flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                                    Salir
                                </button>
                                
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl text-gray-700 hover:text-violet-700">
                                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-md font-medium text-gray-600 hover:text-violet-700 transition-colors">Ingresar</Link>
                                <Link href="/login?register=true" className="text-md font-medium text-white bg-violet-700 hover:bg-violet-800 px-4 py-2 rounded-md transition-colors">Registrarse</Link>
                            </div>
                        )}
                    </div>
                </div>

                {isMenuOpen && isLoggedIn && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <RoleSpecificLink isMobile={true} />
                            <Link href="/mis-datos" className="text-md font-medium text-gray-600 hover:text-violet-700 p-2 rounded-md hover:bg-gray-100">Mis Datos</Link>
                            <Link href="/mascotas" className="text-md font-medium text-gray-600 hover:text-violet-700 p-2 rounded-md hover:bg-gray-100">Mis Mascotas</Link>
                            <Link href="/turnos/mis-turnos" className="text-md font-medium text-gray-600 hover:text-violet-700 p-2 rounded-md hover:bg-gray-100">Mis Turnos</Link>
                            <button onClick={cerrarsesion} className="flex items-center gap-3 w-full text-left bg-red-100 text-red-700 font-bold p-3 rounded-lg transition-colors text-md">
                                <FaSignOutAlt />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}