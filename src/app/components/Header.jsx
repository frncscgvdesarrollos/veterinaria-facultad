
'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, loading, logout, userRole } = useAuth();

  return (
    <header className="bg-white text-gray-800 p-4 flex flex-wrap justify-between items-center shadow-md sticky top-0 z-50 w-full gap-y-3 sm:gap-y-0">

      {/* 1. Título a la Izquierda */}
      <div className="flex-shrink-0 mr-4">
        <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900 hover:text-violet-700 transition-colors">
          Veterinaria Magali Martin
        </Link>
      </div>

      {/* 2. Navegación Principal (SIEMPRE VISIBLE si el usuario está logueado) */}
      {user && (
          <nav className="w-full sm:w-auto flex-grow flex justify-center items-center order-3 sm:order-2">
              <div className="flex justify-center items-center space-x-3 md:space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                <Link href="/mis-datos" className="text-xs md:text-sm font-medium hover:text-violet-600 transition-colors uppercase tracking-wider">
                  Mis Datos
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/mascotas" className="text-xs md:text-sm font-medium hover:text-violet-600 transition-colors uppercase tracking-wider">
                  Mis Mascotas
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/mis-turnos" className="text-xs md:text-sm font-medium hover:text-violet-600 transition-colors uppercase tracking-wider">
                  Mis Turnos
                </Link>
              </div>
          </nav>
      )}

      {/* 3. Acciones a la Derecha */}
      <div className="flex-shrink-0 flex items-center order-2 sm:order-3">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center">
            {userRole === 'admin' && (
                <Link href="/admin" className="bg-gray-100 text-gray-600 font-semibold px-3 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors mr-2">
                  Admin
                </Link>
            )}
            <button onClick={logout} className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-full transition-colors text-sm">
              Salir
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-full transition-colors">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
