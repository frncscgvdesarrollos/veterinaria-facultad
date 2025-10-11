'use client';

import { useState, useEffect } from 'react';
import { obtenerServicios, eliminarServicio, toggleServicioActivo } from './actions';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSpinner, FaInfoCircle } from 'react-icons/fa';

// Componente para la tabla de una categoría específica
const TablaServicio = ({ titulo, categoria, servicios, onUpdate }) => {
    const esPeluqueria = categoria === 'peluqueria';
    const esMedicamento = categoria === 'medicamentos';

    const handleToggle = async (id, estadoActual) => {
        if (window.confirm(`¿Seguro que quieres cambiar el estado de este servicio?`)) {
            await toggleServicioActivo(categoria, id, estadoActual);
            onUpdate(); // Refresca los datos
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este servicio permanentemente?')) {
            await eliminarServicio(categoria, id);
            onUpdate(); // Refresca los datos
        }
    };

    // Función para obtener el rango de precios en peluquería
    const getPriceRange = (precios) => {
        const priceValues = Object.values(precios).filter(p => p > 0);
        if (priceValues.length === 0) return 'N/A';
        const min = Math.min(...priceValues);
        const max = Math.max(...priceValues);
        return min === max ? `$${min}` : `$${min} - $${max}`;
    };

    const serviceEntries = Object.entries(servicios || {});

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{titulo}</h3>
            {serviceEntries.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                {!esMedicamento && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>}
                                {esMedicamento && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {serviceEntries.map(([id, servicio]) => (
                                <tr key={id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {servicio.nombre}
                                        <p className='text-xs text-gray-500 max-w-xs truncate'>{servicio.descripcion}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {esPeluqueria ? getPriceRange(servicio.precios) : `$${servicio.precio}`}
                                    </td>
                                    {!esMedicamento && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {servicio.activo ? 
                                                <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Activo</span> : 
                                                <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>Inactivo</span>
                                            }
                                        </td>
                                    )}
                                    {esMedicamento && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.se_aplica_cada_dias} días</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
                                        {!esMedicamento && (
                                            <button onClick={() => handleToggle(id, servicio.activo)} className={`mr-3 ${servicio.activo ? 'text-gray-400 hover:text-gray-600' : 'text-green-500 hover:text-green-700'}`}>
                                                {servicio.activo ? <FaToggleOff size={20}/> : <FaToggleOn size={20}/>}
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 italic">No hay servicios de este tipo definidos.</p>
            )}
        </div>
    );
};

// Componente principal que obtiene y gestiona el estado de los servicios
export default function ListaServicios() {
    const [servicios, setServicios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServicios = async () => {
        try {
            setLoading(true);
            const data = await obtenerServicios();
            setServicios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>;
    }

    if (error) {
        return <p className="text-red-500 bg-red-50 p-4 rounded-md">Error al cargar los servicios: {error}</p>;
    }

    return (
        <div>
            <TablaServicio titulo="Peluquería" categoria="peluqueria" servicios={servicios.peluqueria} onUpdate={fetchServicios} />
            <TablaServicio titulo="Clínica" categoria="clinica" servicios={servicios.clinica} onUpdate={fetchServicios} />
            <TablaServicio titulo="Medicamentos" categoria="medicamentos" servicios={servicios.medicamentos} onUpdate={fetchServicios} />
        </div>
    );
}
