'use client';

import React from 'react';
import { useTurnoWizard } from '../TurnoWizardContext';
import { FaDog, FaCat, FaStethoscope, FaCut, FaSpinner } from 'react-icons/fa';

const ServiceAssignmentRow = ({ mascota, services, onToggle, configServicios }) => (
    <tr className="border-b">
        <td className="py-4 px-2 sm:px-4 font-bold">
            <div className="flex items-center gap-3">
                {mascota.especie.toLowerCase() === 'perro' ? <FaDog className="text-2xl text-gray-400" /> : <FaCat className="text-2xl text-gray-400" />}
                {mascota.nombre}
            </div>
        </td>
        <td className="py-4 px-2 text-center">
            {configServicios.clinica_activa ? (
                <input 
                    type="checkbox" 
                    checked={!!services.clinica} 
                    onChange={() => onToggle(mascota.id, 'clinica')} 
                    className="w-6 h-6 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
            ) : (
                <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full">Suspendido</span>
            )}
        </td>
        <td className="py-4 px-2 text-center">
             {configServicios.peluqueria_activa ? (
                <input 
                    type="checkbox" 
                    checked={!!services.peluqueria} 
                    onChange={() => onToggle(mascota.id, 'peluqueria')} 
                    disabled={mascota.especie.toLowerCase() !== 'perro'} 
                    className="w-6 h-6 rounded text-green-600 focus:ring-green-500 disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer"
                />
             ) : (
                <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full">Suspendido</span>
             )}
        </td>
    </tr>
);

export default function Paso2() {
    const { selectedMascotas, motivosPorMascota, setMotivosPorMascota, configServicios, nextStep } = useTurnoWizard();

    const handleMotivoToggle = (mascotaId, motivo) => {
        if (!configServicios) return; 
        if (motivo === 'clinica' && !configServicios.clinica_activa) return;
        if (motivo === 'peluqueria' && !configServicios.peluqueria_activa) return;
        
        const isTurningOn = !motivosPorMascota[mascotaId]?.[motivo];
        setMotivosPorMascota(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: isTurningOn } }));
    };

    const isStepComplete = selectedMascotas.every(id => {
        if (!configServicios) return false;
        const motivoMascota = motivosPorMascota[id] || {};
        const tieneMotivoValido = (motivoMascota.clinica && configServicios.clinica_activa) || (motivoMascota.peluqueria && configServicios.peluqueria_activa);
        return Object.keys(motivoMascota).length === 0 ? true : tieneMotivoValido;
    });

    if (!configServicios) {
        return <div className="flex justify-center"><FaSpinner className="animate-spin text-2xl" /></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Paso 2: Elige el motivo de la visita</h2>
            {!configServicios.clinica_activa && !configServicios.peluqueria_activa ? (
                <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-bold text-lg text-yellow-800">EL SISTEMA DE TURNOS SE ENCUENTRA CERRADO POR EL MOMENTO.</p>
                    <p className="text-yellow-700 mt-2">Disculpe las molestias. Intente nuevamente más tarde.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-600">Mascota</th>
                                <th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Clínica <FaStethoscope className="inline ml-1"/></th>
                                <th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Peluquería <FaCut className="inline ml-1"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedMascotas.map(mascota => 
                                <ServiceAssignmentRow 
                                    key={mascota.id} 
                                    mascota={mascota} 
                                    services={motivosPorMascota[mascota.id] || {}} 
                                    onToggle={handleMotivoToggle}
                                    configServicios={configServicios}
                                /> 
                            )}
                        </tbody>
                    </table>
                </div>
            )}
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