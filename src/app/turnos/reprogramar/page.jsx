'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import es from 'date-fns/locale/es';
import { reprogramarTurnoPorUsuario } from '@/lib/actions/turnos.user.actions.js';
import { getDiasNoLaborales } from '@/lib/actions/config.actions.js';

const Spinner = () => (
    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
);

function ReprogramarTurnoComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [turnoInfo, setTurnoInfo] = useState({ turnoId: null, userId: null, mascotaId: null });
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [diasNoLaborales, setDiasNoLaborales] = useState([]);

    useEffect(() => {
        const turnoId = searchParams.get('turnoId');
        const userId = searchParams.get('userId');
        const mascotaId = searchParams.get('mascotaId');

        if (!turnoId || !userId || !mascotaId) {
            setError('Información inválida para la reprogramación. Por favor, vuelve a intentarlo.');
        } else {
            setTurnoInfo({ turnoId, userId, mascotaId });
        }
        
        async function fetchDiasNoLaborales() {
            const result = await getDiasNoLaborales();
            if (result.success) {
                setDiasNoLaborales(result.data.map(d => new Date(d)));
            } else {
                console.error("No se pudieron cargar los días no laborales:", result.error);
            }
        }
        fetchDiasNoLaborales();

    }, [searchParams]);

    const disabledDays = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(today.getDate() + 15);
        
        return [
            ...diasNoLaborales,
            { before: new Date(new Date().setDate(today.getDate())) },
            { after: twoWeeksFromNow },
            { dayOfWeek: [0, 6] }
        ];
    }, [diasNoLaborales]);

    const modifiers = {
        noLaboral: diasNoLaborales,
    };
    const modifiersStyles = {
        noLaboral: {
            color: 'white',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
        },
    };
    
    const timeSlots = [];
    for (let h = 9; h < 18; h++) {
        timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }

    const handleDaySelect = (day) => {
        const isDayDisabled = disabledDays.some(matcher => {
            if (matcher instanceof Date && matcher.getTime() === day?.getTime()) return true;
            if (typeof matcher === 'object' && matcher.before && day < matcher.before) return true;
            if (typeof matcher === 'object' && matcher.after && day > matcher.after) return true;
            if (typeof matcher === 'object' && matcher.dayOfWeek && matcher.dayOfWeek.includes(day?.getDay())) return true;
            return false;
        });

        if (isDayDisabled) return;

        setSelectedDay(day);
        setSelectedTime(null);
        setSelectedDate(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        if (selectedDay) {
            const [hours, minutes] = time.split(':');
            const newFullDate = new Date(selectedDay);
            newFullDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            setSelectedDate(newFullDate);
        }
    };
    
    const handleReprogramar = async () => {
        if (!selectedDate) {
            setError('Debes seleccionar una nueva fecha y hora para el turno.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await reprogramarTurnoPorUsuario({
                ...turnoInfo,
                nuevaFecha: selectedDate.toISOString(),
            });

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/turnos/mis-turnos');
                    router.refresh();
                }, 2000);
            } else {
                setError(result.error || 'Ocurrió un error desconocido.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
     };

    if (error && !success) { return ( <div className="text-center text-red-500 bg-red-100 p-6 rounded-lg shadow-md max-w-lg mx-auto"><h2 className="font-bold text-xl mb-2">Error</h2><p>{error}</p><button onClick={() => router.back()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Volver</button></div> ); }
    if (success) { return ( <div className="text-center text-green-700 bg-green-100 p-6 rounded-lg shadow-md max-w-lg mx-auto"><h2 className="font-bold text-xl mb-2">¡Éxito!</h2><p>Tu turno ha sido reprogramado correctamente. Serás redirigido...</p></div> ); }
    if (!turnoInfo.turnoId) { return <div className="text-center"><Spinner/></div>; }

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reprogramar Turno</h1>
            <p className="text-gray-600 mb-8">Selecciona una nueva fecha y hora para tu turno.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-4 text-center">1. Elige el nuevo día</h2>
                     <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDaySelect}
                        locale={es}
                        disabled={disabledDays}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        className="rounded-md border mx-auto"
                    />
                </div>
                
                <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-4 text-center">2. Elige la nueva hora</h2>
                    <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-2">
                        {timeSlots.map(time => (
                            <button 
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                disabled={!selectedDay}
                                className={`p-2 rounded-lg border text-sm font-semibold transition ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:border-blue-500'} disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`}
                            >
                                {time} hs
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-700">Fecha y hora seleccionada:</h3>
                <p className="text-blue-600 font-bold text-xl mb-6 h-8">
                    {selectedDate ? selectedDate.toLocaleString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + ' hs' : 'Por favor, elige día y hora'}
                </p>
                <button 
                    onClick={handleReprogramar}
                    disabled={!selectedDate || loading}
                    className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {loading ? <Spinner/> : 'Confirmar Reprogramación'}
                </button>
            </div>
        </div>
    );
}

export default function ReprogramarTurnoPage() {
    return (
        <Suspense fallback={<div className="text-center p-10"><Spinner/> Cargando...</div>}> 
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <ReprogramarTurnoComponent />
            </main>
        </Suspense>
    );
}
