'use client';

import { useState } from 'react';
import { guardarServicio } from './actions';
import { FaSpinner } from 'react-icons/fa';

const generateServiceId = (name) => {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres especiales excepto espacios y guiones
        .trim()
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
        .replace(/-+/g, '_');
};

const initialState = {
    categoria: 'peluqueria',
    nombre: '',
    descripcion: '',
    activo: true,
    precio: '', // Para clinica y medicamentos
    precios: { // Para peluqueria
        chico: '',
        mediano: '',
        grande: '',
        muy_grande: '',
    },
    se_aplica_cada_dias: '' // Para medicamentos
};

export default function FormularioNuevoServicio({ onServiceAdded }) {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('precios.')) {
            const size = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                precios: { ...prev.precios, [size]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { categoria, nombre, descripcion, activo, precio, precios, se_aplica_cada_dias } = formData;
            const servicioId = generateServiceId(nombre);

            if (!nombre) {
                throw new Error('El nombre del servicio es obligatorio.');
            }

            let data = { nombre, descripcion };

            if (categoria === 'peluqueria') {
                data.activo = activo;
                data.precios = {
                    chico: parseFloat(precios.chico || 0),
                    mediano: parseFloat(precios.mediano || 0),
                    grande: parseFloat(precios.grande || 0),
                    muy_grande: parseFloat(precios.muy_grande || 0),
                };
            } else if (categoria === 'clinica') {
                data.activo = activo;
                data.precio = parseFloat(precio || 0);
            } else { // Medicamentos
                data.precio = parseFloat(precio || 0);
                data.se_aplica_cada_dias = parseInt(se_aplica_cada_dias || 0, 10);
            }
            
            const result = await guardarServicio(categoria, servicioId, data);

            if (result.success) {
                setSuccess(`¡Servicio '${nombre}' guardado con éxito!`);
                setFormData(initialState); // Resetear formulario
                if(onServiceAdded) onServiceAdded(); // Llama al callback si existe
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Agregar o Editar Servicio</h3>
            
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

                {/* Nombre y Descripción */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>

                {/* --- CAMPOS CONDICIONALES --- */}
                
                {/* Para Peluquería */}
                {formData.categoria === 'peluqueria' && (
                    <div className='space-y-4 p-4 border border-gray-200 rounded-lg'>
                         <p className="font-medium text-gray-800">Precios por Tamaño</p>
                         <div className='grid grid-cols-2 gap-4'>
                            <div>
                               <label htmlFor="precios.chico" className="block text-xs text-gray-600">Chico</label>
                               <input type="number" id="precios.chico" name="precios.chico" value={formData.precios.chico} onChange={handleChange} min="0" className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                               <label htmlFor="precios.mediano" className="block text-xs text-gray-600">Mediano</label>
                               <input type="number" id="precios.mediano" name="precios.mediano" value={formData.precios.mediano} onChange={handleChange} min="0" className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                               <label htmlFor="precios.grande" className="block text-xs text-gray-600">Grande</label>
                               <input type="number" id="precios.grande" name="precios.grande" value={formData.precios.grande} onChange={handleChange} min="0" className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                               <label htmlFor="precios.muy_grande" className="block text-xs text-gray-600">Muy Grande</label>
                               <input type="number" id="precios.muy_grande" name="precios.muy_grande" value={formData.precios.muy_grande} onChange={handleChange} min="0" className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md" />
                            </div>
                         </div>
                    </div>
                )}

                {/* Para Clínica y Medicamentos */}
                {(formData.categoria === 'clinica' || formData.categoria === 'medicamentos') && (
                     <div>
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                        <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                )}
                
                {/* Para Medicamentos */}
                {formData.categoria === 'medicamentos' && (
                     <div>
                        <label htmlFor="se_aplica_cada_dias" className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Aplicación (días)</label>
                        <input type="number" id="se_aplica_cada_dias" name="se_aplica_cada_dias" value={formData.se_aplica_cada_dias} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                )}

                {/* Toggle Activo (No para medicamentos) */}
                {formData.categoria !== 'medicamentos' && (
                    <div className="flex items-center">
                        <input id="activo" name="activo" type="checkbox" checked={formData.activo} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">Servicio Activo</label>
                    </div>
                )}
                

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
