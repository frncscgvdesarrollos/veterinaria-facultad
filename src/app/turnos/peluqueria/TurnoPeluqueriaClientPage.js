'use client'

import { useState } from 'react';
import FormularioTurnoPeluqueria from '@/app/components/FormularioTurnoPeluqueria';
import { SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TurnoPeluqueriaClientPage({ mascotas, ocupacion }) {
    const [incluirTransporte, setIncluirTransporte] = useState(false);
    
    // Es importante convertir los strings de fecha de vuelta a objetos Date
    const ocupacionFechas = ocupacion ? ocupacion.map(dateString => new Date(dateString)) : [];

    const mascotasPerros = mascotas ? mascotas.filter(m => m.especie.toLowerCase() === 'perro') : [];

    if (!mascotas || mascotasPerros.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-yellow-500" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-800">No tienes perros registrados</h2>
                    <p className="mt-4 text-gray-600">
                        El servicio de peluquería solo está disponible para perros. Por favor, registra a tu perro para poder solicitar un turno.
                    </p>
                     <a href="/mascotas/nueva" className="mt-8 inline-block bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-300">
                        Registrar Perro
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                 <div className="text-center mb-12">
                    <SparklesIcon className="mx-auto h-12 w-12 text-pink-500" />
                    <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Turno de Peluquería Canina
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                        Solo para perros. Agenda una sesión de estilo y cuidado para tu compañero.
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl-pink-500/20 max-w-4xl mx-auto border border-gray-200/50">
                    <div 
                        className={`flex items-center justify-center mb-8 p-4 rounded-xl cursor-pointer transition-all duration-300 ${incluirTransporte ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-200'}`}
                        onClick={() => setIncluirTransporte(!incluirTransporte)}
                    >
                        <input 
                            type="checkbox" 
                            id="transporte" 
                            checked={incluirTransporte} 
                            readOnly
                            className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 pointer-events-none"
                        />
                        <label htmlFor="transporte" className="ml-4 text-lg font-medium text-gray-800 cursor-pointer">¿Incluir servicio de transporte? (Costo adicional)</label>
                    </div>

                    <FormularioTurnoPeluqueria 
                        mascotas={mascotasPerros} 
                        ocupacion={ocupacionFechas}
                        incluirTransporte={incluirTransporte} 
                    />
                </div>
            </div>
        </div>
    );
}
