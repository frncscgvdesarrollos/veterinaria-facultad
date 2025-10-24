'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    const router = useRouter();

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
        if (user.displayName) {
            displayIdentifier = user.displayName.split(' ')[0];
        } 
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
                    
                    {isLoggedIn && (
                         <nav className="hidden md:flex items-center gap-8">
                            <Link href="/mis-datos" className="text-lg font-medium text-gray-600 hover:text-violet-700 transition-colors">Mis Datos</Link>
                            <Link href="/mascotas" className="text-lg font-medium text-gray-600 hover:text-violet-700 transition-colors">Mis Mascotas</Link>
                            <Link href="/turnos/mis-turnos" className="text-lg font-medium text-gray-600 hover:text-violet-700 transition-colors">Turnos</Link>
                         </nav>
                    )}

                    <div className="flex-grow md:hidden"></div>

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
                                <button onClick={cerrarsesion} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors text-base">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                 <Link href="/login">
                                    <span className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base">Iniciar Sesión</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
