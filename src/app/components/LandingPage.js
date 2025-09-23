'use client';
import Link from 'next/link';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-gray-800"
      style={{ backgroundImage: "url('/patron1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* Hero Section */}
      <section className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 shadow-lg">
          Cuidamos lo que más amas
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-10">
          La plataforma integral para gestionar la salud, el bienestar y la felicidad de tus mascotas. Turnos online, tienda de productos y un espacio para encontrar un nuevo amigo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/login">
            <span className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg">
              <FiLogIn />
              Iniciar Sesión
            </span>
          </Link>
          <Link href="/login"> 
            <span className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-violet-600 font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg border border-violet-200">
              <FiUserPlus />
              Crear Cuenta
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
