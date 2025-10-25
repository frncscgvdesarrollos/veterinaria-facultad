'use client';

import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import FormularioNuevoServicio from './FormularioNuevoServicio';
import ListaServicios from './ListaServicios';
import DisponibilidadCalendario from './DisponibilidadCalendario'; // Importamos el nuevo componente
import { obtenerServicios, obtenerConfiguracionServicios, toggleCategoriaActiva, obtenerDiasBloqueados } from '@/lib/actions/servicios.actions.js';
import { FaPlus, FaSpinner } from 'react-icons/fa';

// Componente para un único interruptor de categoría (sin cambios)
const InterruptorCategoria = ({ nombre, categoria, activo, onToggle }) => {
    return (
        <div className={`p-4 rounded-lg flex items-center justify-between transition-colors ${activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">Servicio de {nombre}</p>
            <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${activo ? 'text-green-700' : 'text-red-700'}`}>
                    {activo ? 'Disponible' : 'No Disponible'}
                </span>
                <button 
                    onClick={() => onToggle(categoria, activo)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${activo ? 'bg-green-600' : 'bg-gray-400'}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${activo ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
    );
};

export default function ServiciosPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [servicios, setServicios] = useState(null);
    const [config, setConfig] = useState(null);
    const [diasBloqueados, setDiasBloqueados] = useState([]); // Nuevo estado para los días bloqueados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Cargamos todos los datos en paralelo para mayor eficiencia
            const [serviciosData, configData, diasBloqueadosData] = await Promise.all([
                obtenerServicios(),
                obtenerConfiguracionServicios(),
                obtenerDiasBloqueados()
            ]);
            setServicios(serviciosData);
            setConfig(configData);
            setDiasBloqueados(diasBloqueadosData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleCategoria = async (categoria, estadoActual) => {
        try {
            setConfig(prevConfig => ({...prevConfig, [`${categoria}_activa`]: !estadoActual}));
            await toggleCategoriaActiva(categoria, estadoActual);
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            setConfig(prevConfig => ({...prevConfig, [`${categoria}_activa`]: estadoActual}));
             alert('Hubo un error al cambiar el estado del servicio.');
        }
    };

    const handleServiceAdded = () => {
        setModalOpen(false);
        fetchData();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
                        <p className="mt-1 text-md text-gray-600">Activa o desactiva categorías y administra los servicios ofrecidos.</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200">
                        <FaPlus className="mr-2" />
                        Añadir Servicio
                    </button>
                </header>

                {loading && (
                     <div className="flex justify-center items-center p-8"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>
                )}

                {error && (
                    <p className="text-red-500 bg-red-50 p-4 rounded-md">Error al cargar los datos: {error}</p>
                )}
                
                {!loading && !error && (
                    <>
                        {/* Panel de Control Global */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {config && (
                                <>
                                    <InterruptorCategoria 
                                        nombre="Peluquería"
                                        categoria="peluqueria"
                                        activo={config.peluqueria_activa}
                                        onToggle={handleToggleCategoria}
                                    />
                                    <InterruptorCategoria 
                                        nombre="Clínica"
                                        categoria="clinica"
                                        activo={config.clinica_activa}
                                        onToggle={handleToggleCategoria}
                                    />
                                </>
                            )}
                        </div>

                        {/* Calendario de Disponibilidad */}
                        <DisponibilidadCalendario diasBloqueados={diasBloqueados} />

                        {/* Lista de Servicios */}
                        <ListaServicios servicios={servicios} config={config} onUpdate={fetchData} />
                    </>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Añadir Nuevo Servicio">
                <FormularioNuevoServicio onServiceAdded={handleServiceAdded} />
            </Modal>
        </div>
    );
}
