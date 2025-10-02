'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitarTurno } from '@/app/actions/turnosActions';

const horariosPeluqueria = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'
];

export default function FormularioTurnoPeluqueria({ mascotas, ocupacion, incluirTransporte }) {
    const router = useRouter();
    const [selectedMascotas, setSelectedMascotas] = useState([]);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const handleMascotaSelection = (mascotaId) => {
        setSelectedMascotas(prev =>
            prev.includes(mascotaId) ? prev.filter(id => id !== mascotaId) : [...prev, mascotaId]
        );
    };

    const handleDateChange = (e) => {
        setFecha(e.target.value);
        setHora('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedMascotas.length === 0 || !fecha || !hora) {
            setError('Por favor, selecciona al menos una mascota y completa todos los campos.');
            return;
        }

        // Validar si hay suficientes cupos para todas las mascotas seleccionadas
        const ocupacionFecha = ocupacion[fecha] || {};
        const cuposDisponibles = 1 - (ocupacionFecha[hora] || 0);
        if (selectedMascotas.length > cuposDisponibles) {
            setError(`No hay suficientes cupos para ${selectedMascotas.length} perros a las ${hora}. Por favor, elige otro horario o menos mascotas.`);
            return;
        }

        setError('');
        setIsSubmitting(true);

        const formData = {
            mascotaIds: selectedMascotas, // Enviar un array de IDs
            fecha,
            hora,
            tipo: 'peluqueria',
            transporte: incluirTransporte,
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
        return horariosPeluqueria.filter(h => !ocupacionFecha[h] || ocupacionFecha[h] < 1);
    };

    const horariosDisponibles = getHorariosDisponibles();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 font-bold text-center">{error}</p>}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Elige a tus perros:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mascotas.map(m => (
                        <div key={m.id} 
                             onClick={() => handleMascotaSelection(m.id)} 
                             className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedMascotas.includes(m.id) ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-white border-gray-300 hover:border-indigo-400'}`}>
                            <label htmlFor={`mascota-${m.id}`} className="flex items-center space-x-3 cursor-pointer">
                               <input 
                                   type="checkbox" 
                                   id={`mascota-${m.id}`} 
                                   checked={selectedMascotas.includes(m.id)} 
                                   readOnly 
                                   className="h-5 w-5 rounded-sm border-gray-300 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="font-medium text-gray-800">{m.nombre}</span>
                            </label>
                        </div>
                    ))}
                </div>
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
                <button type="submit" disabled={isSubmitting || !hora || selectedMascotas.length === 0} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300">
                    {isSubmitting ? 'Reservando...' : 'Confirmar Turno'}
                </button>
            </div>
        </form>
    );
}
