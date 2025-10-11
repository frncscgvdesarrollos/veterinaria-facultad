'use client';

import { useState } from 'react';
import { obtenerPrecios, actualizarPrecios } from './actions';
import { FaSpinner } from 'react-icons/fa';

const initialState = {
    categoria: 'peluqueria',
    nombre: '',
    tamano: 'chico',
    precio: '',
    activo: true,
};

export default function FormularioNuevoServicio() {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Obtener la estructura de precios actual
            const preciosActuales = await obtenerPrecios();

            // 2. Crear el nuevo objeto de servicio
            const nuevoServicio = {
                nombre: formData.nombre,
                precio: parseFloat(formData.precio),
                activo: formData.activo,
            };

            if (formData.categoria === 'peluqueria') {
                nuevoServicio.tamano = formData.tamano;
            }
            
            // 3. Añadir el nuevo servicio a la categoría correspondiente
            const nuevosPrecios = { ...preciosActuales };
            if (!nuevosPrecios[formData.categoria]) {
                nuevosPrecios[formData.categoria] = [];
            }
            nuevosPrecios[formData.categoria].push(nuevoServicio);

            // 4. Actualizar el documento en Firestore
            const result = await actualizarPrecios(nuevosPrecios);

            if (result.success) {
                setSuccess('¡Servicio agregado con éxito!');
                setFormData(initialState); // Resetear el formulario
            } else {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Servicio</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Categoría */}
                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="peluqueria">Peluquería</option>
                        <option value="clinica">Clínica</option>
                        <option value="medicamentos">Medicamentos</option>
                    </select>
                </div>

                {/* Nombre del Servicio */}
                 <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                {/* Tamaño (solo para peluquería) */}
                {formData.categoria === 'peluqueria' && (
                    <div>
                        <label htmlFor="tamano" className="block text-sm font-medium text-gray-700 mb-1">Tamaño (solo perros)</label>
                        <select id="tamano" name="tamano" value={formData.tamano} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="chico">Chico</option>
                            <option value="mediano">Mediano</option>
                            <option value="grande">Grande</option>
                            <option value="muygrande">Muy Grande</option>
                        </select>
                    </div>
                )}

                {/* Precio */}
                <div>
                    <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                 {/* Botón de Guardar */}
                <div className="flex items-center justify-end pt-4">
                    <button type="submit" disabled={loading} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                         {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                         {loading ? 'Guardando...' : 'Guardar Servicio'}
                    </button>
                </div>
            </form>

            {/* Mensajes de feedback */}
            {success && <p className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</p>}
            {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">Error: {error}</p>}
        </div>
    );
}
