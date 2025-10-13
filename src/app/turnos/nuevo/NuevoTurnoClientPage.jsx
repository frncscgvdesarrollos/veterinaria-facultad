'use client'

import Link from 'next/link';
import FormularioNuevoTurno from "@/app/components/FormularioNuevoTurno";
import { FaPaw } from 'react-icons/fa';

// --- Componente Cliente para la página de Nuevo Turno ---
export default function NuevoTurnoClientPage({ mascotas, ocupacion }) {
    const tieneMascotas = mascotas && mascotas.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    {tieneMascotas ? "Solicita un Nuevo Turno" : "¡Un paso más!"}
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    {tieneMascotas 
                        ? "Elige el servicio y encontraremos el mejor momento para tu mascota."
                        : "Para solicitar un turno, primero necesitas registrar a tu mascota."
                    }
                </p>
            </div>

            <div className="mt-10 w-full sm:max-w-3xl">
                {tieneMascotas ? (
                    // Si tiene mascotas, muestra el formulario de turnos
                    <FormularioNuevoTurno mascotas={mascotas} ocupacion={ocupacion} />
                ) : (
                    // Si no tiene mascotas, muestra una tarjeta de bienvenida y un botón para registrar
                    <div className="bg-white text-center p-8 rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
                        <FaPaw className="mx-auto h-16 w-16 text-indigo-300" />
                        <h3 className="mt-6 text-2xl font-bold text-gray-800">Registra tu primera mascota</h3>
                        <p className="mt-2 text-gray-600">
                            Es rápido y fácil. Una vez que hayas añadido a tu compañero, podrás solicitar turnos, ver su historial y mucho más.
                        </p>
                        <div className="mt-8">
                            <Link href="/mascotas/nueva" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                                Registrar Mascota Ahora
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
