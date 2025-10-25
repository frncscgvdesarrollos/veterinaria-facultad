'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import { reprogramarTurnoPorUsuario, getTurnoDetailsForReprogramming, getAvailableSlotsForReprogramming } from '@/lib/actions/turnos.user.actions.js';
import { getDiasNoLaborales } from '@/lib/actions/config.actions.js';

const Spinner = ({ small } = {}) => (
    <div className={`border-2 ${small ? 'border-white' : 'border-gray-200'} border-t-blue-500 rounded-full ${small ? 'w-5 h-5' : 'w-8 h-8'} animate-spin`}></div>
);

function ReprogramarTurnoComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- ¡NUEVOS ESTADOS! ---
    const [turnoDetails, setTurnoDetails] = useState(null); // Para guardar { tipo, necesitaTraslado, mascota }
    const [availableSlots, setAvailableSlots] = useState([]); // Para guardar los horarios disponibles del día
    const [slotsLoading, setSlotsLoading] = useState(false); // Para el spinner de horarios
    
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [finalDate, setFinalDate] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [slotsError, setSlotsError] = useState(null); // Error específico para la carga de horarios
    const [success, setSuccess] = useState(false);
    const [diasNoLaborales, setDiasNoLaborales] = useState([]);

    const turnoInfo = useMemo(() => ({
        turnoId: searchParams.get('turnoId'),
        userId: searchParams.get('userId'),
        mascotaId: searchParams.get('mascotaId'),
    }), [searchParams]);

    useEffect(() => {
        async function fetchInitialData() {
            if (!turnoInfo.turnoId) {
                setError('Información inválida para la reprogramación.');
                return;
            }
            
            setLoading(true);
            const detailsResult = await getTurnoDetailsForReprogramming(turnoInfo);
            if (detailsResult.success) {
                setTurnoDetails(detailsResult.data);
            } else {
                setError(detailsResult.error);
            }

            const diasResult = await getDiasNoLaborales();
            if (diasResult.success) {
                setDiasNoLaborales(diasResult.data.map(d => new Date(d)));
            }
            setLoading(false);
        }

        fetchInitialData();
    }, [turnoInfo]);

    const disabledDays = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [
            ...diasNoLaborales,
            { before: today },
            { dayOfWeek: [0, 6] }
        ];
    }, [diasNoLaborales]);

    // --- ¡FUNCIÓN CLAVE MODIFICADA! --- 
    // Ahora busca horarios disponibles en el servidor al seleccionar un día
    const handleDaySelect = async (day) => {
        setSelectedDay(day);
        setSelectedTime(null);
        setFinalDate(null);
        setAvailableSlots([]); // Resetea horarios
        setSlotsError(null);

        if (!day || !turnoDetails) return;
        
        const isDayDisabled = disabledDays.some(matcher => {
            if (matcher instanceof Date && matcher.getTime() === day.getTime()) return true;
            if (typeof matcher === 'object' && matcher.before && day < matcher.before) return true;
            if (typeof matcher === 'object' && matcher.dayOfWeek && matcher.dayOfWeek.includes(day.getDay())) return true;
            return false;
        });

        if (isDayDisabled) return;

        setSlotsLoading(true);
        const result = await getAvailableSlotsForReprogramming({
            fecha: dayjs(day).format('YYYY-MM-DD'),
            tipo: turnoDetails.tipo,
            necesitaTraslado: turnoDetails.necesitaTraslado,
            mascota: turnoDetails.mascota,
            turnoId: turnoInfo.turnoId,
        });
        
        
        if (result.success) {
            setAvailableSlots(result.data.horarios);
            if (result.data.horarios.length === 0) {
                 setSlotsError(result.error || "No hay horarios disponibles para este día.")
            }
        } else {
            setSlotsError(result.error);
        }
        setSlotsLoading(false);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        if (selectedDay) {
            let newFullDate = new Date(selectedDay);
            if (turnoDetails.tipo === 'clinica') {
                 const [hours, minutes] = time.split(':').map(Number);
                 newFullDate.setHours(hours, minutes, 0, 0);
            } else { // Peluquería
                const hour = time === 'mañana' ? 9 : 14;
                newFullDate.setHours(hour, 0, 0, 0);
            }
            setFinalDate(newFullDate);
        }
    };
    
    const handleReprogramar = async () => {
        if (!finalDate) return;
        setLoading(true);
        setError(null);
        const result = await reprogramarTurnoPorUsuario({ ...turnoInfo, nuevaFecha: finalDate.toISOString() });
        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push('/turnos/mis-turnos'), 2000);
        } else {
            setError(result.error);
        }
        setLoading(false);
     };

    if (loading && !turnoDetails) { return <div className="text-center"><Spinner/></div>; }
    if (error && !success) { return ( <div className="text-center text-red-500 bg-red-100 p-6 rounded-lg max-w-lg mx-auto"><h2 className="font-bold text-xl mb-2">Error</h2><p>{error}</p><button onClick={() => router.back()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Volver</button></div> ); }
    if (success) { return ( <div className="text-center text-green-700 bg-green-100 p-6 rounded-lg max-w-lg mx-auto"><h2 className="font-bold text-xl mb-2">¡Éxito!</h2><p>Tu turno ha sido reprogramado. Serás redirigido...</p></div> ); }
    if (!turnoInfo.turnoId || !turnoDetails) { return <div className="text-center"><Spinner/></div>; }

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reprogramar Turno</h1>
            <p className="text-gray-600 mb-8">Servicio de <span className="font-semibold">{turnoDetails.tipo}</span> para <span className="font-semibold">{turnoDetails.mascota.nombre}</span>.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                     <h2 className="font-semibold text-lg mb-4 text-center">1. Elige el nuevo día</h2>
                     <DayPicker mode="single" selected={selectedDay} onSelect={handleDaySelect} locale={es} disabled={disabledDays} className="rounded-md border mx-auto"/>
                </div>
                
                <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-4 text-center">2. Elige la nueva hora</h2>
                    <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-2">
                        {slotsLoading && <div className="col-span-3 flex justify-center items-center h-24"><Spinner/></div>}
                        {!slotsLoading && availableSlots.length > 0 && availableSlots.map(time => (
                            <button key={time} onClick={() => handleTimeSelect(time)} disabled={!selectedDay} className={`p-2 rounded-lg border text-sm font-semibold transition ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:border-blue-500'}`}>
                                {time}{turnoDetails.tipo === 'clinica' ? ' hs' : ''}
                            </button>
                        ))}
                         {!slotsLoading && selectedDay && <p className="col-span-3 text-center text-sm text-red-500 bg-red-50 p-2 rounded-md">{slotsError}</p>}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-700">Fecha y hora seleccionada:</h3>
                <p className="text-blue-600 font-bold text-xl mb-6 h-8">
                    {finalDate ? dayjs(finalDate).format('dddd, D [de] MMMM [a las] HH:mm [hs]') : 'Por favor, elige día y hora'}
                </p>
                <button onClick={handleReprogramar} disabled={!finalDate || loading} className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center text-lg">
                    {loading ? <Spinner small/> : 'Confirmar Reprogramación'}
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
