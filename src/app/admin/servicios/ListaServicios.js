'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { eliminarServicio } from '@/lib/actions/servicios.actions.js';
import Modal from '@/app/components/Modal'; // Importamos Modal
import FormularioEditarServicio from './FormularioEditarServicio'; // Importamos el nuevo formulario

const TablaServicio = ({ titulo, categoria, servicios, onUpdate, CategoriaActiva }) => {
    const [servicioAEditar, setServicioAEditar] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este servicio permanentemente?')) {
            await eliminarServicio(categoria, id);
            onUpdate(); // Refresca los datos
        }
    };
    
    const handleEdit = (id, servicio) => {
        setServicioAEditar({ id, ...servicio });
    };

    const handleCloseModal = () => {
        setServicioAEditar(null);
    };

    const handleServiceUpdated = () => {
        handleCloseModal();
        onUpdate();
    };

    const getPriceRange = (precios) => {
        const priceValues = Object.values(precios).filter(p => p > 0);
        if (priceValues.length === 0) return 'N/A';
        const min = Math.min(...priceValues);
        const max = Math.max(...priceValues);
        return min === max ? `$${min}` : `$${min} - $${max}`;
    };

    const serviceEntries = Object.entries(servicios || {});
    const isCurrentlyActive = categoria === 'medicamentos' ? true : CategoriaActiva;

    return (
        <div className={`relative bg-white p-6 rounded-2xl shadow-lg mb-8 transition-opacity duration-300 ${isCurrentlyActive ? 'opacity-100' : 'opacity-50'}`}>
            {!isCurrentlyActive && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-2xl z-10 flex items-center justify-center">
                    <div className="text-center p-4 bg-white rounded-lg shadow-xl">
                         <FaInfoCircle className="mx-auto text-4xl text-blue-500 mb-2"/>
                         <p className="font-bold text-gray-700">Categoría Desactivada</p>
                         <p className="text-sm text-gray-500">Actívala desde el panel para usar estos servicios.</p>
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
                                {categoria === 'medicamentos' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>}
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
                                        {categoria === 'peluqueria' ? getPriceRange(servicio.precios) : `$${servicio.precio}`}
                                    </td>
                                    {categoria === 'medicamentos' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.se_aplica_cada_dias} días</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(id, servicio)} className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
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
            
            {/* Modal para editar servicio */}
            {servicioAEditar && (
                <Modal isOpen={!!servicioAEditar} onClose={handleCloseModal} title={`Editar Servicio: ${servicioAEditar.nombre}`}>
                    <FormularioEditarServicio 
                        servicio={servicioAEditar}
                        categoria={categoria}
                        servicioId={servicioAEditar.id}
                        onServiceUpdated={handleServiceUpdated}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default function ListaServicios({ servicios, config, onUpdate }) {
    if (!servicios || !config) {
        return null;
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
