'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import { crearTurnosPeluqueria } from '@/lib/actions/turnos.actions.js';
import { FaDog, FaArrowLeft, FaCut, FaSun, FaMoon, FaCalendarAlt, FaTruck, FaMoneyBillWave, FaCreditCard, FaSpinner } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande', 'muy grande': 'muy_grande' };

const MascotaWizardCard = ({ mascota, isSelected, onToggle }) => (
    <div onClick={onToggle} className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white dark:bg-gray-700 hover:bg-gray-50'}`}>
        <div className="flex items-center"><div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${isSelected ? 'bg-blue-500' : 'border-2 border-gray-400'}`}>{isSelected && <span className="text-white font-bold text-sm">✓</span>}</div><FaDog className={`text-3xl mr-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} /><div><p className="font-bold text-lg">{mascota.nombre}</p><p className="text-sm text-gray-600">{mascota.raza}</p></div></div>
    </div>
);

export default function NuevoTurnoWizardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [mascotas, setMascotas] = useState([]);
    const [serviciosPeluqueria, setServiciosPeluqueria] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);
    const [selectedMascotasIds, setSelectedMascotasIds] = useState([]);
    const [serviciosPorMascota, setServiciosPorMascota] = useState({});
    const [fecha, setFecha] = useState('');
    const [turnoHorario, setTurnoHorario] = useState('');
    const [necesitaTraslado, setNecesitaTraslado] = useState(false);
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login?redirectTo=/turnos/nuevo');
        if (user) {
            const cargarDatos = async () => {
                setLoadingData(true);
                try {
                    const mascotasSnap = await getDocs(query(collection(db, 'users', user.uid, 'mascotas'), orderBy('nombre', 'asc')));
                    setMascotas(mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    const serviciosSnap = await getDoc(doc(db, 'servicios', 'catalogo'));
                    if (serviciosSnap.exists()) {
                        setServiciosPeluqueria(Object.entries(serviciosSnap.data().peluqueria || {}).map(([id, val]) => ({ id, ...val })));
                    }
                } catch (err) { setError('Ocurrió un error al cargar los datos.'); } finally { setLoadingData(false); }
            };
            cargarDatos();
        }
    }, [user, authLoading, router]);

    const nextStep = () => setStep(p => p + 1);
    const prevStep = () => setStep(p => p - 1);

    const handleMascotaToggle = (id) => setSelectedMascotasIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    const handleServicioChange = (mascotaId, servicioId) => setServiciosPorMascota(p => ({ ...p, [mascotaId]: servicioId }));

    const perros = useMemo(() => mascotas.filter(m => m.especie.toLowerCase() === 'perro'), [mascotas]);
    const fullSelectedMascotas = useMemo(() => mascotas.filter(m => selectedMascotasIds.includes(m.id)), [mascotas, selectedMascotasIds]);

    const precioTotal = useMemo(() => {
        return fullSelectedMascotas.reduce((total, mascota) => {
            const servicioId = serviciosPorMascota[mascota.id];
            const servicio = serviciosPeluqueria.find(s => s.id === servicioId);
            if (!servicio) return total;
            const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
            return total + (servicio.precios[tamañoKey] || 0);
        }, 0);
    }, [fullSelectedMascotas, serviciosPorMascota, serviciosPeluqueria]);

    const isStep1Complete = selectedMascotasIds.length > 0;
    const isStep2Complete = fullSelectedMascotas.length > 0 && fullSelectedMascotas.every(m => serviciosPorMascota[m.id]);
    const isStep3Complete = fecha !== '' && turnoHorario !== '';

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Creando turnos...');

        const turnosData = {
            selectedMascotas: fullSelectedMascotas,
            serviciosPorMascota,
            serviciosPeluqueria,
            fecha,
            turnoHorario,
            necesitaTransporte: necesitaTraslado,
            metodoPago,
        };

        try {
            const result = await crearTurnosPeluqueria(user, turnosData);
            if (result.success) {
                toast.success('¡Turnos creados con éxito!', { id: toastId });
                router.push('/turnos');
            } else {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || loadingData) return <div className="p-12 text-center">Cargando...</div>;
    if (error) return <div className="p-12 text-center text-red-500">Error: {error}</div>;
    if (user && perros.length === 0) return <div className="p-6 text-center"><h3>No tienes perros</h3><Link href="/mascotas/nueva">Registrar</Link></div>;

    return (
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border mt-10 mb-20">
            <Toaster position="top-center" />
            <div className="p-4 sm:p-6 border-b"><button onClick={prevStep} disabled={step === 1} className="flex items-center gap-2 text-sm font-semibold text-gray-600 disabled:opacity-50"><FaArrowLeft /> Volver</button></div>

            <div className="p-6 sm:p-8 md:p-10">
                {step === 1 && <div><h2 className="text-2xl font-bold mb-8">Paso 1: Selecciona tu mascota</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{perros.map(m => <MascotaWizardCard key={m.id} mascota={m} isSelected={selectedMascotasIds.includes(m.id)} onToggle={() => handleMascotaToggle(m.id)} />)}</div></div>}
                {step === 2 && <div><h2 className="text-2xl font-bold mb-8">Paso 2: Elige los servicios</h2><div className="space-y-6">{fullSelectedMascotas.map(mascota => { const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico'; return (<div key={mascota.id} className="p-4 bg-gray-50 rounded-xl flex items-center gap-4"><p className="font-bold text-lg flex-1">{mascota.nombre}</p><div className="relative w-full sm:w-2/3"><FaCut className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><select value={serviciosPorMascota[mascota.id] || ''} onChange={(e) => handleServicioChange(mascota.id, e.target.value)} required className="pl-10 pr-4 py-3 w-full bg-white border-gray-300 rounded-lg"><option value="" disabled>-- Elige un servicio --</option>{serviciosPeluqueria.map(s => <option key={s.id} value={s.id}>{s.nombre} (+${s.precios[tamañoKey] || 'N/A'})</option>)}</select></div></div>);})}</div></div>}
                {step === 3 && <div><h2 className="text-2xl font-bold mb-8">Paso 3: Elige Fecha y Turno</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10"><div className="relative"><label className="block text-sm font-bold text-gray-700 mb-2">Día</label><FaCalendarAlt className="absolute top-12 left-3 text-gray-400" /><input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required className="p-3 pl-10 w-full bg-white border rounded-lg" min={new Date().toISOString().split('T')[0]} /></div><div><label className="block text-sm font-bold text-gray-700 mb-2">Horario</label><div className="flex gap-4"><button type="button" onClick={() => setTurnoHorario('mañana')} className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${turnoHorario === 'mañana' ? 'border-blue-500 bg-blue-50' : ''}`}><FaSun /> Mañana</button><button type="button" onClick={() => setTurnoHorario('tarde')} className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${turnoHorario === 'tarde' ? 'border-blue-500 bg-blue-50' : ''}`}><FaMoon /> Tarde</button></div></div></div></div>}
                {step === 4 && <div><h2 className="text-2xl font-bold mb-8">Paso 4: Detalles Finales y Confirmación</h2><div className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="p-4 border rounded-lg"><div className="flex items-center justify-between"><div className="flex items-center"><FaTruck className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">¿Necesitas traslado?</span></div><button type="button" onClick={() => setNecesitaTraslado(!necesitaTraslado)} className={`relative inline-flex items-center h-6 rounded-full w-11 ${necesitaTraslado ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full ${necesitaTraslado ? 'translate-x-6' : 'translate-x-1'}`}/></button></div></div><div className="p-4 border rounded-lg"><div className="flex items-center mb-3"><FaCreditCard className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">Método de pago</span></div><div className="flex gap-4"><button type="button" onClick={() => setMetodoPago('efectivo')} className={`flex-1 p-3 rounded-lg border-2 ${metodoPago === 'efectivo' ? 'border-blue-500 bg-blue-50' : ''}`}><FaMoneyBillWave className="inline mr-2"/> Efectivo</button><button type="button" onClick={() => setMetodoPago('transferencia')} className={`flex-1 p-3 rounded-lg border-2 ${metodoPago === 'transferencia' ? 'border-blue-500 bg-blue-50' : ''}`}><FaCreditCard className="inline mr-2"/> Transferencia</button></div></div></div><div className="p-6 bg-gray-50 rounded-xl border"><h3 className="text-xl font-bold mb-4 border-b pb-2">Resumen del Turno</h3><div className="space-y-3"><p><strong>Mascota(s):</strong> {fullSelectedMascotas.map(m => m.nombre).join(', ')}</p><p><strong>Día y Hora:</strong> {fecha} - <span className="capitalize">{turnoHorario}</span></p><div className="text-right mt-4"><p className="text-lg text-gray-600">Precio Total Estimado:</p><p className="text-4xl font-extrabold">${precioTotal.toFixed(2)}</p></div></div></div></div></div>}
            </div>

            <div className="p-4 sm:p-6 border-t flex justify-end">
                {step < 4 && <button onClick={nextStep} disabled={step === 1 ? !isStep1Complete : step === 2 ? !isStep2Complete : !isStep3Complete} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">Siguiente</button>}
                {step === 4 && <button onClick={handleFinalSubmit} disabled={isSubmitting} className="px-8 py-3 w-full md:w-auto bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg">{isSubmitting ? <><FaSpinner className="animate-spin"/> Procesando...</> : 'Confirmar y Reservar Turno'}</button>}
            </div>
        </section>
    );
}
