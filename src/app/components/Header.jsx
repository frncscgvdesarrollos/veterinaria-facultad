'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Función para obtener iniciales para el avatar de fallback
const getInitials = (name) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    
    const displayName = user?.name ? user.name.split(' ')[0] : 'Usuario';

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
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden lg:inline text-md font-medium text-gray-700">Hola, {displayName}</span>
                                <div className="flex items-center justify-center bg-violet-100 rounded-full h-14 w-14 text-violet-700 font-bold text-xl overflow-hidden">
                                    {user.photoURL ? (
                                        <Image src={user.photoURL} alt="Avatar del usuario" width={56} height={56} />
                                    ) : (
                                        <span>{getInitials(user.name)}</span>
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
