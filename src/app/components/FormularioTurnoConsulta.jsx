'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitarTurno } from '@/app/actions/turnosActions';

// Horarios disponibles para consultas
const horariosConsulta = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// Número de veterinarios disponibles
const VETERINARIOS_DISPONIBLES = 2;

export default function FormularioTurnoConsulta({ mascotas, ocupacion }) {
    const router = useRouter();
    const [mascotaId, setMascotaId] = useState(mascotas[0]?.id || '');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const handleDateChange = (e) => {
        setFecha(e.target.value);
        setHora('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mascotaId || !fecha || !hora) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        setError('');
        setIsSubmitting(true);

        const formData = {
            mascotaId,
            fecha,
            hora,
            tipo: 'consulta',
        };

        const result = await solicitarTurno(formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.push('/mis-turnos');
        }
    };
    
    const getHorariosDisponibles = () => {
        if (!fecha) return [];
        const ocupacionFecha = ocupacion[fecha] || {};
        // Puede haber hasta X veterinarios atendiendo consultas a la vez
        return horariosConsulta.filter(h => !ocupacionFecha[h] || ocupacionFecha[h] < VETERINARIOS_DISPONIBLES);
    };

    const horariosDisponibles = getHorariosDisponibles();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 font-bold text-center">{error}</p>}

            <div>
                <label htmlFor="mascota" className="block text-sm font-medium text-gray-700 mb-1">Elige a tu mascota:</label>
                <select id="mascota" value={mascotaId} onChange={(e) => setMascotaId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    {mascotas.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
                <input type="date" id="fecha" value={fecha} onChange={handleDateChange} min={hoy.toISOString().split('T')[0]} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            {fecha && horariosDisponibles.length > 0 && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {horariosDisponibles.map(h => (
                            <button key={h} type="button" onClick={() => setHora(h)} className={`p-3 rounded-lg text-center font-semibold transition ${hora === h ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-800 hover:bg-indigo-100'}`}>
                                {h}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {fecha && horariosDisponibles.length === 0 && (
                <p className="text-center text-yellow-600 font-semibold bg-yellow-50 p-3 rounded-lg">No hay horarios disponibles para la fecha seleccionada. Por favor, elige otro día.</p>
            )}

            <div className="pt-4">
                <button type="submit" disabled={isSubmitting || !hora} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300">
                    {isSubmitting ? 'Reservando...' : 'Confirmar Turno'}
                </button>
            </div>
        </form>
    );
}
