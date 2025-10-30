'use client';

import React from 'react';
import { useTurnoWizard } from '../TurnoWizardContext';
import { FaStethoscope, FaCut, FaSpinner } from 'react-icons/fa';

const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

const ServicioDetalleSelector = ({ mascota, motivo, catalogo, specificServices, onServiceChange }) => {
    const serviciosDisponibles = catalogo[motivo] || [];
    const valorActual = specificServices[mascota.id]?.[motivo] || '';

    if (serviciosDisponibles.length === 0) {
        return <p className="text-sm text-gray-500">No hay servicios de {motivo} disponibles.</p>;
    }

    const getPrecio = (servicio) => {
        if (motivo === 'clinica') return servicio.precio || 0; // <-- CORREGIDO
        if (motivo === 'peluqueria') {
            const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
            return servicio.precios[tamañoKey] || 0;
        }
        return 0;
    };

    return (
        <select 
            value={valorActual} 
            onChange={(e) => onServiceChange(mascota.id, motivo, e.target.value)} 
            required 
            className="p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>-- Elige un servicio --</option>
            {serviciosDisponibles.map(s => <option key={s.id} value={s.id}>{s.nombre} (+${getPrecio(s)})</option>)}
        </select>
    );
};

export default function Paso3() {
    const { 
        selectedMascotas, 
        motivosPorMascota, 
        specificServices, 
        setSpecificServices,
        catalogoServicios,
        configServicios,
        nextStep
    } = useTurnoWizard();

    const handleSpecificServiceChange = (mascotaId, motivo, serviceId) => {
        setSpecificServices(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: serviceId } }));
    };

    const isStepComplete = selectedMascotas.every(m => {
        const mot = motivosPorMascota[m.id] || {};
        const serv = specificServices[m.id] || {};
        if (mot.clinica && !serv.clinica) return false;
        if (mot.peluqueria && !serv.peluqueria) return false;
        return true;
    });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Paso 3: Detalla los servicios</h2>
            <div className="space-y-8">
                {selectedMascotas.map(mascota => {
                    const motivos = motivosPorMascota[mascota.id];
                    if (!motivos || (!motivos.clinica && !motivos.peluqueria)) return null;

                    return (
                        <div key={mascota.id} className="p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                            <h3 className="font-bold text-xl mb-4 text-gray-800">{mascota.nombre}</h3>
                            <div className="space-y-4">
                                {motivos.clinica && configServicios.clinica_activa && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                            <FaStethoscope /> Servicio de Clínica
                                        </label>
                                        <ServicioDetalleSelector 
                                            mascota={mascota} 
                                            motivo="clinica" 
                                            catalogo={catalogoServicios} 
                                            specificServices={specificServices} 
                                            onServiceChange={handleSpecificServiceChange} 
                                        />
                                    </div>
                                )}
                                {motivos.peluqueria && configServicios.peluqueria_activa && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                            <FaCut /> Servicio de Peluquería
                                        </label>
                                        <ServicioDetalleSelector 
                                            mascota={mascota} 
                                            motivo="peluqueria" 
                                            catalogo={catalogoServicios} 
                                            specificServices={specificServices} 
                                            onServiceChange={handleSpecificServiceChange} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-4 sm:p-6 border-t flex justify-end mt-8">
                <button 
                    onClick={nextStep} 
                    disabled={!isStepComplete} 
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">
                    Siguiente
                </button>
            </div>
        </div>
    );
}