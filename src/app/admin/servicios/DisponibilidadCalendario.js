'use client';

import { useState, useTransition } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaSpinner } from 'react-icons/fa';
import { actualizarDiasNoLaborales } from '@/lib/actions/config.admin.actions.js'; // Importamos la nueva acción
import toast from 'react-hot-toast';

// Helper para formatear la fecha como YYYY-MM-DD en UTC (sin cambios)
const toUTCDateString = (date) => {
    if (!date) return '';
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function DisponibilidadCalendario({ diasBloqueados: initialDiasBloqueados = [] }) {
    // Normalizamos las fechas iniciales a objetos Date en UTC (sin cambios)
    const initialDates = initialDiasBloqueados.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    });

    // Estado para los días seleccionados en el calendario
    const [selectedDays, setSelectedDays] = useState(initialDates);
    // useTransition para manejar el estado de carga de la acción del servidor
    const [isPending, startTransition] = useTransition();

    const handleDayClick = (day, { selected }) => {
        // Actualizamos el estado local de los días seleccionados
        if (selected) {
            setSelectedDays(prev => prev.filter(d => d.getTime() !== day.getTime()));
        } else {
            setSelectedDays(prev => [...prev, day]);
        }
    };

    const handleGuardarCambios = () => {
        // Convertimos los objetos Date a strings en formato YYYY-MM-DD
        const nuevasFechas = selectedDays.map(toUTCDateString);

        startTransition(async () => {
            const toastId = toast.loading('Guardando cambios y actualizando turnos...');
            
            try {
                const result = await actualizarDiasNoLaborales({ nuevasFechas });

                if (result.success) {
                    let successMessage = '¡Calendario actualizado con éxito!';
                    if (result.reprogramadosCount > 0) {
                        successMessage += ` Se marcaron ${result.reprogramadosCount} turnos para reprogramación.`
                    }
                    toast.success(successMessage, { id: toastId });
                } else {
                    throw new Error(result.error || 'Ocurrió un error desconocido.');
                }

            } catch (error) {
                console.error("Error al guardar los días no laborales:", error);
                toast.error(`Error al guardar: ${error.message}`, { id: toastId });
            }
        });
    };

    const footer = selectedDays.length > 0
        ? `Días a bloquear: ${selectedDays.length}. No olvides guardar los cambios.`
        : `Selecciona uno o más días para marcarlos como no disponibles.`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg relative mt-8">
            {isPending && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-2">Gestión de Días No Laborables</h3>
            <p className="text-gray-600 mb-4">
                Haz clic en las fechas para agregarlas o quitarlas de la lista de días no disponibles.
                <br/>
                <span className="font-semibold">Recuerda hacer clic en "Guardar Cambios" para aplicar la configuración.</span>
            </p>
            <div className="flex flex-col items-center">
                <DayPicker
                    mode="multiple"
                    min={0}
                    selected={selectedDays}
                    onDayClick={handleDayClick} // Se usa onDayClick en lugar de onSelect
                    modifiersClassNames={{
                        selected: '!bg-red-500 !text-white rounded-full',
                        today: '!text-blue-500 font-bold'
                    }}
                     styles={{
                        day: { transition: 'background-color 0.2s ease-in-out' },
                        head_cell: { fontWeight: 'bold' },
                    }}
                    footer={<p className="text-center text-sm text-gray-500 mt-4">{footer}</p>}
                />
                <button 
                    onClick={handleGuardarCambios} 
                    disabled={isPending} 
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}
