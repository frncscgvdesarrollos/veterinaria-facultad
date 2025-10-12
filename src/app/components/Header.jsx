'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos el router de Next.js

// Función para obtener la inicial del nombre a mostrar
const getInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth(); 
    const router = useRouter(); // Instanciamos el router

    // Lógica de cierre de sesión CORREGIDA
    const cerrarsesion = async () => {
        try {
            await logout(); // Esperamos a que el logout se complete
            router.push('/'); // Redirigimos usando el router de Next.js
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Opcional: Mostrar una notificación al usuario de que hubo un error
        }
    }
    
    // Lógica mejorada para obtener el nombre a mostrar
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
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    Clínica Veterinaria
                </Link>
                {isLoggedIn && (
                     <nav className="ml-10 space-x-4 hidden md:flex">
                        <Link href="/turnos" className="hover:text-gray-300">Turnos</Link>
                        <Link href="/mis-mascotas" className="hover:text-gray-300">Mis Mascotas</Link>
                        <Link href="/adopciones" className="hover:text-gray-300">Adopciones</Link>
                     </nav>
                )}
            </div>

            <div>
                {isLoggedIn ? (
                    <div className="relative flex items-center">
                        <span className="mr-4 hidden sm:inline">Hola, {displayIdentifier}</span>
                        <div className="group">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer text-xl font-bold">
                                {user.photoURL ? (
                                    <Image src={user.photoURL} alt="Foto de perfil" width={40} height={40} className="rounded-full" />
                                ) : (
                                    <span>{getInitial(displayIdentifier)}</span>
                                )}
                            </div>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                                <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                                <button
                                    onClick={cerrarsesion}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <nav className="space-x-4">
                        <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-700">Iniciar Sesión</pre>
                        <Link href="/register" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Registrarse</pre>
                    </nav>
                )}
            </div>
        </header>
    );
}
