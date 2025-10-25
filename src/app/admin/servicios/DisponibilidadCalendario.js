'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaSpinner } from 'react-icons/fa';
import { bloquearDia, desbloquearDia } from '@/lib/actions/servicios.actions.js';
import toast from 'react-hot-toast';

// Helper para formatear la fecha como YYYY-MM-DD en UTC
const toUTCDateString = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function DisponibilidadCalendario({ diasBloqueados: initialDiasBloqueados = [] }) {
    // Normalizamos las fechas iniciales a objetos Date en UTC para evitar problemas de zona horaria
    const initialDates = initialDiasBloqueados.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    });

    const [diasBloqueados, setDiasBloqueados] = useState(initialDates);
    const [isLoading, setIsLoading] = useState(false);

    const handleDayClick = async (day, { selected }) => {
        // Evitar doble click mientras carga
        if (isLoading) return;

        setIsLoading(true);
        const dateString = toUTCDateString(day);

        try {
            let result;
            if (selected) {
                // Si el día ya estaba seleccionado, lo desbloqueamos
                result = await desbloquearDia(dateString);
                if (result.success) {
                    setDiasBloqueados(prev => prev.filter(d => toUTCDateString(d) !== dateString));
                    toast.success(`Día ${dateString} desbloqueado.`);
                } else {
                    throw new Error(result.error || 'No se pudo desbloquear el día.');
                }
            } else {
                // Si el día no estaba seleccionado, lo bloqueamos
                result = await bloquearDia(dateString);
                if (result.success) {
                    // Añadimos la nueva fecha UTC al estado
                    const [year, month, dayNum] = dateString.split('-').map(Number);
                    setDiasBloqueados(prev => [...prev, new Date(Date.UTC(year, month - 1, dayNum))]);
                    toast.success(`Día ${dateString} bloqueado.`);
                } else {
                    throw new Error(result.error || 'No se pudo bloquear el día.');
                }
            }
        } catch (error) {
            console.error("Error al actualizar la disponibilidad:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const footer = diasBloqueados.length > 0
        ? `Días bloqueados: ${diasBloqueados.length}.`
        : `Selecciona uno o más días para marcarlos como no disponibles.`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg relative mt-8">
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gestión de Días No Laborables</h3>
            <p className="text-gray-600 mb-4">
                Haz clic en una fecha para bloquearla o desbloquearla. Los días marcados no estarán disponibles para agendar turnos.
            </p>
            <div className="flex justify-center">
                <DayPicker
                    mode="multiple"
                    min={0}
                    selected={diasBloqueados}
                    onDayClick={handleDayClick}
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
            </div>
        </div>
    );
}
