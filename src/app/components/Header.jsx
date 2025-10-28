'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    const router = useRouter();
    const pathname = usePathname();

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

    const RoleSpecificLink = () => {
        const baseClasses = "text-md font-semibold text-violet-700 hover:text-violet-900 transition-colors flex items-center gap-2";

        if (!user || !user.role) return null;

        switch (user.role) {
            case 'admin':
                return <Link href="/admin" className={baseClasses}><FaUserShield />Panel Admin</Link>;
            case 'peluqueria':
                return <Link href="/admin/empleados/peluqueria" className={baseClasses}><FaUserShield />Portal Peluquería</Link>;
            case 'transporte':
                return <Link href="/admin/empleados/transporte" className={baseClasses}><FaUserShield />Portal Transporte</Link>;
            default:
                return null;
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 w-full">
            <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image 
                                src="/LOGO.svg" 
                                alt="Logo Veterinaria Magali Martin"
                                width={180}
                                height={50}
                                priority
                            />
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4">
                        {isLoggedIn && user ? (
                            <>
                                <div className="hidden md:flex">
                                    <RoleSpecificLink />
                                </div>
                                
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

                                <button onClick={cerrarsesion} title="Cerrar Sesión" className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm h-11 w-11 sm:w-auto sm:px-4">
                                    <FaSignOutAlt className="text-lg" />
                                    <span className="hidden sm:inline sm:ml-2">Salir</span>
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
            </nav>
        </header>
    );
}