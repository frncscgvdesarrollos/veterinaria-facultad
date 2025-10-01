'use client';

import { useState } from 'react';

// Este es el formulario restaurado a un estado anterior.
// La lógica de envío se ha desactivado para revertir los cambios no solicitados.

export default function FormularioTurnoConsulta({ mascotas = [] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('Funcionalidad no conectada.');
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // No se realiza ninguna acción de servidor.
        alert('Este formulario no está conectado. Se está restaurando el estado anterior de la aplicación.');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700">Solicitar Turno de Consulta</h2>
            
            {/* Selector de Mascota */}
            <div>
                <label htmlFor="mascotaId" className="block text-sm font-medium text-gray-700 mb-2">Mascota</label>
                <select id="mascotaId" name="mascotaId" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                    <option value="" disabled>Selecciona una mascota</option>
                    {mascotas.map(mascota => (
                        <option key={mascota.id} value={mascota.id}>{mascota.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Selector de Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input type="date" id="fecha" name="fecha" required min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-2">Horario</label>
                    <input type="time" id="turno" name="turno" required min="09:00" max="18:00" step="1800" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            {/* Motivo de la Consulta */}
            <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">Motivo de la Consulta</label>
                <textarea id="motivo" name="motivo" rows={4} required placeholder="Describe brevemente el motivo de la visita (ej. control anual, vómitos, cojera, etc.)" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            
            {/* Método de Pago */}
            <div>
                <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select id="metodoPago" name="metodoPago" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                </select>
            </div>

            {/* Botón de Envío y Mensajes */}
            <div className="text-center">
                <button type="submit" disabled={loading} className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-300">
                    {loading ? 'Enviando...' : 'Solicitar Turno'}
                </button>
                {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">Error: {error}</p>}
                {success && <p className="mt-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
            </div>
        </form>
    );
}
