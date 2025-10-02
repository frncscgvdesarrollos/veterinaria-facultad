'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Función para obtener la inicial del nombre a mostrar
const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    
    // Lógica mejorada para obtener el nombre a mostrar
    let displayIdentifier = 'Usuario';
    if (user) {
        // Prioridad 1: Usar el `displayName` si existe y no está vacío.
        if (user.displayName) {
            displayIdentifier = user.displayName.split(' ')[0];
        } 
        // Prioridad 2: Usar la parte local del email si no hay `displayName`.
        else if (user.email) {
            displayIdentifier = user.email.split('@')[0];
        }
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
            <nav className="max-w-screen-xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image 
                                src="/LOGO.svg" 
                                alt="Logo de Veterinaria Magali Martin"
                                width={200}
                                height={55}
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="flex items-center gap-4 min-w-[250px] justify-end">
                        {isLoggedIn && user ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden lg:inline text-md font-medium text-gray-700 capitalize">Hola, {displayIdentifier}</span>
                                <div className="flex items-center justify-center bg-violet-100 rounded-full h-14 w-14 text-violet-700 font-bold text-xl overflow-hidden">
                                    {user.photoURL ? (
                                        <Image src={user.photoURL} alt="Avatar del usuario" width={56} height={56} />
                                    ) : (
                                        <span>{getInitial(displayIdentifier)}</span>
                                    )}
                                </div>
                                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors text-base">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <span className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base">Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
