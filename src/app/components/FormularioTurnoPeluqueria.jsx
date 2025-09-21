
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { solicitarTurnoPeluqueria } from '@/app/actions/turnosActions';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

export default function FormularioTurnoPeluqueria({ 
    mascotas, 
    ocupacion, 
    disabledDays: initialDisabledDays, 
    maxTurnosManana,
    maxTurnosTarde
}) {
    const { user } = useAuth();
    const [mascota, setMascota] = useState('');
    const [fecha, setFecha] = useState(null);
    const [turno, setTurno] = useState('');
    const [servicios, setServicios] = useState({ cepillado: false, rapado: false, corteTijera: false });
    const [transporte, setTransporte] = useState(false);
    const [metodoPago, setMetodoPago] = useState(''); // NUEVO ESTADO: para el método de pago
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [isMananaDisabled, setMananaDisabled] = useState(false);
    const [isTardeDisabled, setTardeDisabled] = useState(false);

    const disabledDays = initialDisabledDays.map(day => {
        if (typeof day === 'string') return new Date(day + 'T12:00:00');
        return day;
    });

    useEffect(() => {
        if (fecha) {
            const fechaString = fecha.toISOString().split('T')[0];
            const ocupacionDia = ocupacion[fechaString];
            setMananaDisabled(ocupacionDia && ocupacionDia.manana >= maxTurnosManana);
            setTardeDisabled(ocupacionDia && ocupacionDia.tarde >= maxTurnosTarde);
            if ((turno === 'manana' && isMananaDisabled) || (turno === 'tarde' && isTardeDisabled)) setTurno('');
        }
    }, [fecha, ocupacion, maxTurnosManana, maxTurnosTarde, turno, isMananaDisabled, isTardeDisabled]);

    const handleServicioChange = (e) => setServicios(prev => ({ ...prev, [e.target.name]: e.target.checked }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user || !mascota || !fecha || !turno || !metodoPago) { // Añadida validación para metodoPago
            setError('Por favor, completa todos los campos, incluido el método de pago.');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        const servicesArray = Object.keys(servicios).filter(key => servicios[key]);
        const selectedMascota = mascotas.find(m => m.id === mascota);

        const turnoData = {
            clienteId: user.uid,
            mascotaId: mascota,
            tamañoMascota: selectedMascota?.tamaño,
            fecha: fecha.toISOString().split('T')[0],
            turno,
            servicios: servicesArray,
            transporte,
            metodoPago, 
            tipo: 'peluqueria',
            // Otros campos a medida que crecen las vistas y se amplian las funcionalidades.
        };

        try {
            const result = await solicitarTurnoPeluqueria(turnoData);
            if (result.success) {
                setSuccess('¡Solicitud de turno enviada con éxito! Nos pondremos en contacto para confirmar.');
                setMascota(''); setFecha(null); setTurno(''); setTransporte(false); setMetodoPago(''); // Resetear metodoPago
                setServicios({ cepillado: false, rapado: false, corteTijera: false });
            } else {
                setError(result.error || 'No se pudo procesar la solicitud.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-7">
            <h2 className="text-2xl font-bold text-center text-gray-800">Solicitar Turno de Peluquería</h2>

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center font-semibold">{error}</p>}
            {success && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md text-center font-semibold">{success}</p>}

            <div>
                <label htmlFor="mascota" className="block text-sm font-medium text-gray-700 mb-1">Elige tu mascota</label>
                <select id="mascota" value={mascota} onChange={(e) => setMascota(e.target.value)} required className="w-full input">
                    <option value="">Selecciona una mascota</option>
                    {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.tamaño})</option>)}
                </select>
            </div>

            <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Selecciona el día</label>
                <DayPicker mode="single" selected={fecha} onSelect={setFecha} locale={es} disabled={disabledDays} className="bg-violet-50 p-4 rounded-lg" modifiersClassNames={{ selected: 'bg-violet-600 text-white', today: 'text-violet-700 font-bold' }}/>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">2. Selecciona el turno disponible</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setTurno('manana')} disabled={isMananaDisabled || !fecha} className={`py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${turno === 'manana' ? 'bg-violet-600 text-white shadow-lg ring-2 ring-violet-400' : 'bg-gray-200 text-gray-700'} ${isMananaDisabled || !fecha ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 'hover:bg-violet-500 hover:text-white'}`}>
                        Turno Mañana (8hs - 12hs)
                    </button>
                    <button type="button" onClick={() => setTurno('tarde')} disabled={isTardeDisabled || !fecha} className={`py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${turno === 'tarde' ? 'bg-violet-600 text-white shadow-lg ring-2 ring-violet-400' : 'bg-gray-200 text-gray-700'} ${isTardeDisabled || !fecha ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 'hover:bg-violet-500 hover:text-white'}`}>
                        Turno Tarde (13hs - 17hs)
                    </button>
                 </div>
            </div>

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">3. Elige el método de pago</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setMetodoPago('efectivo')} className={`flex items-center justify-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${metodoPago === 'efectivo' ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300' : 'bg-gray-200 text-gray-700'} hover:bg-green-400 hover:text-white`}>
                        <FaMoneyBillWave className="mr-2" />
                        Efectivo
                    </button>
                    <button type="button" onClick={() => setMetodoPago('mercado_pago')} className={`flex items-center justify-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${metodoPago === 'mercado_pago' ? 'bg-sky-500 text-white shadow-lg ring-2 ring-sky-300' : 'bg-gray-200 text-gray-700'} hover:bg-sky-400 hover:text-white`}>
                        <FaCreditCard className="mr-2" />
                        Mercado Pago
                    </button>
                 </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servicios Adicionales (Opcional)</label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <input id="cepillado" name="cepillado" type="checkbox" checked={servicios.cepillado} onChange={handleServicioChange} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                        <label htmlFor="cepillado" className="ml-3 block text-sm text-gray-800">Cepillado</label>
                    </div>
                    <div className="flex items-center">
                        <input id="rapado" name="rapado" type="checkbox" checked={servicios.rapado} onChange={handleServicioChange} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                        <label htmlFor="rapado" className="ml-3 block text-sm text-gray-800">Rapado Parejo</label>
                    </div>
                    <div className="flex items-center">
                        <input id="corteTijera" name="corteTijera" type="checkbox" checked={servicios.corteTijera} onChange={handleServicioChange} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                        <label htmlFor="corteTijera" className="ml-3 block text-sm text-gray-800">Corte a Tijera</label>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <input id="transporte" name="transporte" type="checkbox" checked={transporte} onChange={(e) => setTransporte(e.target.checked)} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
                    <label htmlFor="transporte" className="ml-3 block text-sm font-medium text-gray-800">¿Necesitas transporte? (Opcional)</label>
                </div>
            </div>

            <button type="submit" disabled={loading || !fecha || !turno || !mascota || !metodoPago} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? 'Enviando Solicitud...' : 'Solicitar Turno'}
            </button>
        </form>
    );
}
