'use client';

import { useState, useEffect } from 'react';
import { actualizarServicio } from '@/lib/actions/servicios.actions.js';
import { FaSpinner } from 'react-icons/fa';

const InputField = ({ label, name, value, onChange, type = 'text', required = true, pattern, title }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            pattern={pattern}
            title={title}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const PriceField = ({ label, name, value, onChange }) => (
    <InputField label={label} name={name} value={value} onChange={onChange} type="number" pattern="\d*" title="Solo números" />
);

export default function FormularioEditarServicio({ servicio, categoria, servicioId, onServiceUpdated, onClose }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (servicio) {
            setFormData(servicio);
        }
    }, [servicio]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('precios.')) {
            const priceKey = name.split('.')[1];
            setFormData(prev => ({ 
                ...prev, 
                precios: { ...prev.precios, [priceKey]: value === '' ? '' : Number(value) } 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const res = await actualizarServicio(categoria, servicioId, formData);
            if (res.success) {
                onServiceUpdated(); // Llama a la función para refrescar y cerrar
            } else {
                throw new Error(res.error || 'Ocurrió un error al actualizar.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const esPeluqueria = categoria === 'peluqueria';
    const esMedicamento = categoria === 'medicamentos';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Nombre del Servicio" name="nombre" value={formData.nombre || ''} onChange={handleChange} />
            <InputField label="Descripción" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} required={false} />

            {esPeluqueria && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="col-span-full text-lg font-medium text-gray-800">Precios por Tamaño</h3>
                    <PriceField label="Pequeño" name="precios.pequeño" value={formData.precios?.pequeño || ''} onChange={handleChange} />
                    <PriceField label="Mediano" name="precios.mediano" value={formData.precios?.mediano || ''} onChange={handleChange} />
                    <PriceField label="Grande" name="precios.grande" value={formData.precios?.grande || ''} onChange={handleChange} />
                    <PriceField label="Gigante" name="precios.gigante" value={formData.precios?.gigante || ''} onChange={handleChange} />
                </div>
            )}

            {!esPeluqueria && (
                 <PriceField label="Precio" name="precio" value={formData.precio || ''} onChange={handleChange} />
            )}

            {esMedicamento && (
                <InputField 
                    label="Frecuencia de Aplicación (días)" 
                    name="se_aplica_cada_dias" 
                    value={formData.se_aplica_cada_dias || ''} 
                    onChange={handleChange}
                    type="number"
                />
            )}
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-blue-300">
                    {loading ? <FaSpinner className="animate-spin" /> : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
