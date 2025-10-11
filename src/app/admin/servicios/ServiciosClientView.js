'use client';

import { useState } from 'react';
import FormularioNuevoServicio from './FormularioNuevoServicio';

export default function ServiciosClientView({ children }) {
  const [vista, setVista] = useState('lista'); // 'lista' o 'formulario'

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Servicios</h1>
                <p className="text-gray-600">Crea, edita y administra los servicios de la veterinaria.</p>
            </div>
            <div>
                <button 
                    onClick={() => setVista(vista === 'lista' ? 'formulario' : 'lista')}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    {vista === 'lista' ? 'Agregar Nuevo Servicio' : 'Ver Lista de Servicios'}
                </button>
            </div>
        </div>

        <div>
            {vista === 'lista' ? children : <FormularioNuevoServicio />}
        </div>
    </div>
  );
}
