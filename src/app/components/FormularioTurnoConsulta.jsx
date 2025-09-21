
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { solicitarTurnoConsulta } from '@/app/actions/turnosActions';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

export default function FormularioTurnoConsulta({ mascotas }) {
    const { user } = useAuth();
    const [mascota, setMascota] = useState('');
    const [fecha, setFecha] = useState(null);
    const [turno, setTurno] = useState('');
    const [motivo, setMotivo] = useState('');
    const [metodoPago, setMetodoPago] = useState(''); // NUEVO ESTADO
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            setError('Tu sesión ha expirado, por favor, recarga la página.');
            return;
        }
        if (!mascota || !fecha || !turno || !motivo || !metodoPago) { // Añadida validación
            setError('Por favor, completa todos los campos, incluido el método de pago.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        
        const turnoData = {
            clienteId: user.uid,
            mascotaId: mascota,
            fecha: fecha.toISOString().split('T')[0],
            turno,
            motivo,
            metodoPago, 
            tipo: 'consulta',
            // Otros campos a medida que crecen las vistas y se amplian las funcionalidades.
        };

        try {
            const result = await solicitarTurnoConsulta(turnoData);
            if (result.success) {
                setSuccess('¡Solicitud de turno enviada con éxito! Recibirás una confirmación por la misma vía.');
                setMascota(''); setFecha(null); setTurno(''); setMotivo(''); setMetodoPago(''); // Reset
            } else {
                setError(result.error || 'No se pudo procesar la solicitud.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado al comunicarnos con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Solicitar Turno para Consulta</h2>

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">{success}</p>}

            <div>
                <label htmlFor="mascota" className="block text-sm font-medium text-gray-700 mb-1">Elige tu mascota</label>
                <select id="mascota" value={mascota} onChange={(e) => setMascota(e.target.value)} required className="w-full input">
                    <option value="">Selecciona una mascota</option>
                    {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
            </div>

            <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">1. Selecciona el día</label>
                <DayPicker mode="single" selected={fecha} onSelect={setFecha} locale={es} fromDate={today} className="bg-violet-50 p-4 rounded-lg" modifiersClassNames={{ selected: 'bg-violet-600 text-white', today: 'text-violet-700 font-bold' }} disabled={{ before: today }}/>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">2. Selecciona el turno</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setTurno('manana')} className={`py-3 rounded-lg text-sm font-semibold transition-colors ${turno === 'manana' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                        Turno Mañana (8hs - 12hs)
                    </button>
                    <button type="button" onClick={() => setTurno('tarde')} className={`py-3 rounded-lg text-sm font-semibold transition-colors ${turno === 'tarde' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                        Turno Tarde (13hs - 17hs)
                    </button>
                 </div>
            </div>

            <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">3. Motivo de la Consulta</label>
                <textarea id="motivo" name="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} rows="4" required className="w-full input" placeholder="Describe brevemente el motivo de la consulta (ej. control anual, vómitos, cojera, etc.)"></textarea>
            </div>

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">4. Elige el método de pago</label>
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

            <button type="submit" disabled={loading || !fecha || !turno || !mascota || !motivo || !metodoPago} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? 'Enviando Solicitud...' : 'Solicitar Turno'}
            </button>
        </form>
    );
}
