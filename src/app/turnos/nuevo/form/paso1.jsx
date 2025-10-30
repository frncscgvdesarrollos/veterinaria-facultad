'use client';

import React from 'react';
import { useTurnoWizard } from '../TurnoWizardContext';
import { FaDog, FaCat, FaCheck, FaSpinner } from 'react-icons/fa';

const MascotaSelectionCard = ({ mascota, isSelected, onToggle }) => (
    <div 
        onClick={() => onToggle(mascota.id)} 
        className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${
            isSelected 
                ? 'bg-blue-50 border-blue-500 shadow-lg' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50'
        }`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
            {isSelected && <FaCheck className="text-white text-xs"/>}
        </div>
        {mascota.especie.toLowerCase() === 'perro' ? <FaDog className="text-3xl text-gray-500" /> : <FaCat className="text-3xl text-gray-500" />}
        <div>
            <p className="font-bold text-lg">{mascota.nombre}</p>
            <p className="text-sm text-gray-600">{mascota.raza}</p>
        </div>
    </div>
);

export default function Paso1() {
    const { mascotas, selectedMascotaIds, handleMascotaToggle, nextStep } = useTurnoWizard();

    const isStepComplete = selectedMascotaIds.length > 0;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Paso 1: ¿Para quién es el turno?</h2>
            <p className="text-gray-600 mb-6">Puedes seleccionar una o varias mascotas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mascotas.map(m => (
                    <MascotaSelectionCard 
                        key={m.id} 
                        mascota={m} 
                        isSelected={selectedMascotaIds.includes(m.id)} 
                        onToggle={handleMascotaToggle} 
                    />
                ))}
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