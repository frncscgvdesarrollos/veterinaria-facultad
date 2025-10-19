'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaDog, FaCalendarAlt, FaClock, FaTruck, FaMoneyBillWave, FaCreditCard, FaCut, FaSun, FaMoon, FaSpinner } from 'react-icons/fa';
import { crearTurnosPeluqueria } from '@/lib/actions/turnos.actions.js';

// --- Mapa de Tamaños para Precios ---
const TAMAÑO_PRECIOS_MAP = {
    'pequeño': 'chico',
    'mediano': 'mediano',
    'grande': 'grande',
};

// --- Componentes de UI Internos ---
const SectionTitle = ({ title }) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 border-b-2 pb-2 border-gray-200">{title}</h3>
);

const MascotaCard = ({ mascota, isSelected, onToggle }) => (
    <div onClick={onToggle} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50'}`}>
        <div className="flex items-center">
            <FaDog className={`text-3xl mr-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{mascota.nombre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{mascota.raza} - <span className="font-semibold capitalize">{mascota.tamaño}</span></p>
            </div>
            <div className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500' : 'border-2 border-gray-400'}`}>
                {isSelected && <span className="text-white font-bold">✓</span>}
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL: Formulario de Peluquería ---
export default function FormularioPeluqueria({ user, mascotas, serviciosPeluqueria }) {
    const router = useRouter();
    const [selectedMascotas, setSelectedMascotas] = useState([]);
    const [serviciosPorMascota, setServiciosPorMascota] = useState({});
    const [fecha, setFecha] = useState('');
    const [turnoHorario, setTurnoHorario] = useState('');
    const [necesitaTransporte, setNecesitaTransporte] = useState(false);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [precioTotal, setPrecioTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fullSelectedMascotas = useMemo(() => mascotas.filter(m => selectedMascotas.includes(m.id)), [mascotas, selectedMascotas]);

    const handleMascotaToggle = (mascotaId) => {
        setSelectedMascotas(prev => {
            const newSelection = prev.includes(mascotaId) ? prev.filter(id => id !== mascotaId) : [...prev, mascotaId];
            if (!newSelection.includes(mascotaId)) {
                setServiciosPorMascota(current => { const newServicios = { ...current }; delete newServicios[mascotaId]; return newServicios; });
            }
            return newSelection;
        });
    };
    
    const handleServicioChange = (mascotaId, servicioId) => {
        setServiciosPorMascota(prev => ({ ...prev, [mascotaId]: servicioId }));
    };

    useEffect(() => {
        let total = 0;
        for (const mascotaId in serviciosPorMascota) {
            const servicioId = serviciosPorMascota[mascotaId];
            const mascota = mascotas.find(m => m.id === mascotaId);
            const servicio = serviciosPeluqueria.find(s => s.id === servicioId);
            if (mascota && servicio && servicio.precios) {
                const tamañoPrecio = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()];
                const precioServicio = servicio.precios[tamañoPrecio];
                if (typeof precioServicio === 'number') total += precioServicio;
            }
        }
        setPrecioTotal(total);
    }, [serviciosPorMascota, mascotas, serviciosPeluqueria]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete) {
            toast.error('Por favor, completa todos los campos antes de continuar.');
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading('Creando turnos...');

        const turnosData = {
            selectedMascotas: fullSelectedMascotas,
            serviciosPorMascota,
            serviciosPeluqueria, 
            fecha,
            turnoHorario,
            necesitaTransporte,
            metodoPago,
        };

        try {
            const result = await crearTurnosPeluqueria(user, turnosData);
            if (result.success) {
                toast.success('¡Turnos de peluquería creados con éxito!', { id: toastId });
                router.push('/turnos'); // Redirige a la página de turnos
            } else {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormComplete = useMemo(() => {
        if (selectedMascotas.length === 0) return false;
        if (selectedMascotas.some(id => !serviciosPorMascota[id])) return false;
        if (!fecha || !turnoHorario) return false;
        return true;
    }, [selectedMascotas, serviciosPorMascota, fecha, turnoHorario]);

    return (
        <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <Toaster position="top-center" />
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Reservar Turno de Peluquería</h2>
                <p className="mt-2 text-sm text-gray-500">Selecciona mascotas, servicios y agenda el turno.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <section>
                    <SectionTitle title="1. Selecciona tus perros" />
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mascotas.filter(m => m.especie.toLowerCase() === 'perro').map(mascota => (
                            <MascotaCard key={mascota.id} mascota={mascota} isSelected={selectedMascotas.includes(mascota.id)} onToggle={() => handleMascotaToggle(mascota.id)} />
                        ))}
                    </div>
                     {mascotas.filter(m => m.especie.toLowerCase() === 'perro').length === 0 && <p className="text-center text-gray-500 py-4">No tienes perros registrados para peluquería.</p>}
                </section>

                {selectedMascotas.length > 0 && (
                    <>
                        <section>
                            <SectionTitle title="2. Elige el servicio para cada mascota" />
                            <div className="space-y-5">
                                {fullSelectedMascotas.map(mascota => {
                                    const tamañoPrecio = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()];
                                    return (
                                        <div key={mascota.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-4">
                                            <p className="font-bold flex-1">{mascota.nombre}</p>
                                            <div className="relative w-full md:w-2/3">
                                                 <FaCut className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                                <select value={serviciosPorMascota[mascota.id] || ''} onChange={(e) => handleServicioChange(mascota.id, e.target.value)} required className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg">
                                                    <option value="" disabled>-- Elige un servicio --</option>
                                                    {serviciosPeluqueria.map(s => (
                                                        <option key={s.id} value={s.id}>{s.nombre} (+${s.precios[tamañoPrecio] || 'N/A'})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                             <SectionTitle title="3. Elige Fecha y Turno" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="fecha" className="block text-sm font-bold text-gray-700 mb-2">Día del turno</label>
                                    <input type="date" id="fecha" value={fecha} onChange={e => setFecha(e.target.value)} required className="p-3 w-full bg-white border border-gray-300 rounded-lg" min={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Horario del turno</label>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setTurnoHorario('mañana')} className={`flex-1 p-3 text-center rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${turnoHorario === 'mañana' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}><FaSun /> Mañana</button>
                                        <button type="button" onClick={() => setTurnoHorario('tarde')} className={`flex-1 p-3 text-center rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${turnoHorario === 'tarde' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}><FaMoon /> Tarde</button>
                                    </div>
                                </div>
                             </div>
                        </section>
                        
                         <section>
                            <SectionTitle title="4. Opciones Adicionales" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center"><FaTruck className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">¿Necesitas transporte?</span></div>
                                   <button type="button" onClick={() => setNecesitaTransporte(!necesitaTransporte)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${necesitaTransporte ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${necesitaTransporte ? 'translate-x-6' : 'translate-x-1'}`}/></button>
                                </div>
                                 <div>
                                   <div className="flex items-center mb-3"><FaCreditCard className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">Método de pago</span></div>
                                   <div className="flex gap-4">
                                       <button type="button" onClick={() => setMetodoPago('efectivo')} className={`flex-1 p-3 text-center rounded-lg border-2 transition-all ${metodoPago === 'efectivo' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}><FaMoneyBillWave className="inline mr-2"/> Efectivo</button>
                                       <button type="button" onClick={() => setMetodoPago('transferencia')} className={`flex-1 p-3 text-center rounded-lg border-2 transition-all ${metodoPago === 'transferencia' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}><FaCreditCard className="inline mr-2"/> Transferencia</button>
                                   </div>
                                 </div>
                            </div>
                        </section>

                        <div className="mt-10 pt-6 border-t-2 border-dashed">
                             <div className="text-right mb-6">
                                <p className="text-lg text-gray-600">Precio Total Estimado:</p>
                                <p className="text-4xl font-extrabold text-gray-900">${precioTotal.toFixed(2)}</p>
                            </div>
                            <button type="submit" disabled={!isFormComplete || isSubmitting} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50">
                                {isSubmitting ? <><FaSpinner className="animate-spin mr-3" /> Procesando...</> : 'Confirmar y Reservar Turno'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
