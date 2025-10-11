'use client';

import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { eliminarServicio } from './actions';

// Componente para la tabla de una categoría específica
const TablaServicio = ({ titulo, categoria, servicios, onUpdate, CategoriaActiva }) => {
    const esPeluqueria = categoria === 'peluqueria';
    const esMedicamento = categoria === 'medicamentos';

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

    // Los medicamentos no tienen un estado global, siempre se muestran como activos.
    const isCurrentlyActive = esMedicamento ? true : CategoriaActiva;

    return (
        <div className={`relative bg-white p-6 rounded-2xl shadow-lg mb-8 transition-opacity duration-300 ${isCurrentlyActive ? 'opacity-100' : 'opacity-50'}`}>
            {!isCurrentlyActive && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-2xl z-10 flex items-center justify-center">
                    <div className="text-center p-4 bg-white rounded-lg shadow-xl">
                         <FaInfoCircle className="mx-auto text-4xl text-blue-500 mb-2"/>
                         <p className="font-bold text-gray-700">Categoría Desactivada</p>
                         <p className="text-sm text-gray-500">Actívala desde el panel de control para usar estos servicios.</p>
                    </div>
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-4">{titulo}</h3>
            {serviceEntries.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
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
                                    {esMedicamento && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.se_aplica_cada_dias} días</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
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

// El componente principal ahora solo recibe las props y las distribuye
export default function ListaServicios({ servicios, config, onUpdate }) {
    if (!servicios || !config) {
        return null; // O un loader más simple si se prefiere
    }

    return (
        <div>
            <TablaServicio 
                titulo="Peluquería" 
                categoria="peluqueria" 
                servicios={servicios.peluqueria} 
                onUpdate={onUpdate} 
                CategoriaActiva={config.peluqueria_activa}
            />
            <TablaServicio 
                titulo="Clínica" 
                categoria="clinica" 
                servicios={servicios.clinica} 
                onUpdate={onUpdate} 
                CategoriaActiva={config.clinica_activa}
            />
            {/* Los medicamentos no tienen un interruptor global, siempre están "activos" */}
            <TablaServicio 
                titulo="Medicamentos" 
                categoria="medicamentos" 
                servicios={servicios.medicamentos} 
                onUpdate={onUpdate} 
                CategoriaActiva={true}
            />
        </div>
    );
}
