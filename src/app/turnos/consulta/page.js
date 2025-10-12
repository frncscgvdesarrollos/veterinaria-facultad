
'use client'

import FormularioTurnoConsulta from '@/app/components/FormularioTurnoConsulta';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TurnoConsultaPage({ mascotas, ocupacion }) {
    if (!mascotas || mascotas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-yellow-500" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-800">No tienes mascotas registradas</h2>
                    <p className="mt-4 text-gray-600">
                        Para solicitar un turno, primero debes registrar al menos una mascota en tu perfil.
                    </p>
                    <a href="/mascotas/nueva" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Registrar Mascota
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <ShieldCheckIcon className="mx-auto h-12 w-12 text-blue-600" />
                    <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Turno de Consulta Veterinaria
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                        Agenda una cita para el cuidado y bienestar de tu mascota.
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl-blue-500/30 max-w-4xl mx-auto border border-gray-200/50">
                    <FormularioTurnoConsulta 
                        mascotas={mascotas}
                        ocupacion={ocupacion} 
                    />
                </div>
            </div>
        </div>
    );
}
