'use client'

import { useState } from 'react';
import FormularioTurnoPeluqueria from '@/app/components/FormularioTurnoPeluqueria';

export default function TurnoPeluqueriaPage({ mascotas, ocupacion }) {
    const [incluirTransporte, setIncluirTransporte] = useState(false);

    // La lógica de negocio se queda aquí, pero los datos vienen de arriba.
    const mascotasPerros = mascotas.filter(m => m.especie.toLowerCase() === 'perro');

    if (mascotasPerros.length === 0) {
        return (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes perros registrados</h2>
                <p className="text-gray-600">El servicio de peluquería solo está disponible para perros. Por favor, registra a tu perro para poder solicitar un turno.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Turno de Peluquería Canina</h1>
                <p className="mt-2 text-lg text-gray-600">Solo para perros. Agenda una sesión de estilo para tu compañero.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
                 <div className="flex items-center justify-center mb-6 bg-blue-50 p-4 rounded-lg">
                    <input 
                        type="checkbox" 
                        id="transporte" 
                        checked={incluirTransporte} 
                        onChange={() => setIncluirTransporte(!incluirTransporte)} 
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="transporte" className="ml-3 text-lg font-medium text-gray-800">¿Incluir servicio de transporte? (Costo adicional)</label>
                </div>

                <FormularioTurnoPeluqueria 
                    mascotas={mascotasPerros} 
                    ocupacion={ocupacion}
                    incluirTransporte={incluirTransporte} 
                />
            </div>
        </div>
    );
}
