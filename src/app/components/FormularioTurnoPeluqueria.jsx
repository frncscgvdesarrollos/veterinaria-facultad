'use client';

import { useState } from 'react';

// Este es el formulario restaurado a un estado anterior.
// La lógica de envío se ha desactivado para revertir los cambios no solicitados.

export default function FormularioTurnoPeluqueria({ mascotas = [] }) {
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
            <h2 className="text-3xl font-bold text-center text-pink-600">Solicitar Turno de Peluquería</h2>
            
            {/* Selector de Mascota */}
            <div>
                <label htmlFor="mascotaId_peluqueria" className="block text-sm font-medium text-gray-700 mb-2">Mascota</label>
                <select id="mascotaId_peluqueria" name="mascotaId" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md shadow-sm">
                    <option value="" disabled>Selecciona una mascota</option>
                    {mascotas.map(mascota => (
                        <option key={mascota.id} value={mascota.id}>{mascota.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Selector de Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fecha_peluqueria" className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input type="date" id="fecha_peluqueria" name="fecha" required min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" />
                </div>
                <div>
                    <label htmlFor="turno_peluqueria" className="block text-sm font-medium text-gray-700 mb-2">Horario</label>
                    <input type="time" id="turno_peluqueria" name="turno" required min="09:00" max="18:00" step="3600" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500" />
                </div>
            </div>

            {/* Tipo de Servicio */}
            <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">Servicio Principal</label>
                 <select id="motivo" name="motivo" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md shadow-sm">
                    <option value="Baño y Corte">Baño y Corte</option>
                    <option value="Solo Baño">Solo Baño</option>
                    <option value="Solo Corte">Solo Corte</option>
                </select>
            </div>

            {/* Servicios Extra */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servicios Adicionales</label>
                <div className="mt-2 space-y-2">
                    <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input id="corteUnas" name="corteUnas" type="checkbox" className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="corteUnas" className="font-medium text-gray-700">Corte de Uñas</label>
                        </div>
                    </div>
                     <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input id="banoMedicado" name="banoMedicado" type="checkbox" className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="banoMedicado" className="font-medium text-gray-700">Baño Medicado o Especial</label>
                        </div>
                    </div>
                     <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input id="limpiezaOidos" name="limpiezaOidos" type="checkbox" className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="limpiezaOidos" className="font-medium text-gray-700">Limpieza de Oídos</label>
                        </div>
                    </div>
                </div>
            </div>

             {/* Método de Pago */}
            <div>
                <label htmlFor="metodoPago_peluqueria" className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</pre-visto</label>
                <select id="metodoPago_peluqueria" name="metodoPago" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md shadow-sm">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                </select>
            </div>

            {/* Botón de Envío y Mensajes */}
            <div className="text-center">
                <button type="submit" disabled={loading} className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-medium rounded-full text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300 transition-colors duration-300">
                    {loading ? 'Enviando...' : 'Solicitar Turno'}
                </button>
                {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">Error: {error}</p>}
                {success && <p className="mt-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
            </div>
        </form>
    );
}
