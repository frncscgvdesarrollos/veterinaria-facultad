'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { FaDog, FaCat, FaArrowLeft, FaCut, FaStethoscope, FaCalendarAlt, FaClock, FaSpinner, FaCheck, FaPlus, FaTruck, FaMoneyBillWave, FaCreditCard, FaSun, FaMoon } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { verificarDisponibilidadTrasladoAction, crearTurnos } from '@/lib/actions/turnos.actions';
import { getDiasNoLaborales } from '@/lib/actions/config.actions.js';


// --- CONFIG & CONSTANTS ---
const VETERINARIOS_DISPONIBLES = 1;
const horariosConsulta = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '15:00', '15:30', '16:00'
];
const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

// --- WIZARD SUB-COMPONENTS ---

const MascotaSelectionCard = ({ mascota, isSelected, onToggle }) => (
    <div onClick={() => onToggle(mascota.id)} className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${isSelected ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white dark:bg-gray-700 hover:bg-gray-50'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isSelected && <FaCheck className="text-white text-xs"/>}</div>
        {mascota.especie.toLowerCase() === 'perro' ? <FaDog className="text-3xl text-gray-500" /> : <FaCat className="text-3xl text-gray-500" />}
        <div><p className="font-bold text-lg">{mascota.nombre}</p><p className="text-sm text-gray-600">{mascota.raza}</p></div>
    </div>
);

const ServiceAssignmentRow = ({ mascota, services, onToggle }) => (
    <tr className="border-b"><td className="py-4 px-2 sm:px-4 font-bold"><div className="flex items-center gap-3">{mascota.especie.toLowerCase() === 'perro' ? <FaDog className="text-2xl text-gray-400" /> : <FaCat className="text-2xl text-gray-400" />}{mascota.nombre}</div></td><td className="py-4 px-2 text-center"><input type="checkbox" checked={!!services.clinica} onChange={() => onToggle(mascota.id, 'clinica')} className="w-6 h-6 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"/></td><td className="py-4 px-2 text-center"><input type="checkbox" checked={!!services.peluqueria} onChange={() => onToggle(mascota.id, 'peluqueria')} disabled={mascota.especie.toLowerCase() !== 'perro'} className="w-6 h-6 rounded text-green-600 focus:ring-green-500 disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer"/></td></tr>
);

const ServicioDetalleSelector = ({ mascota, motivo, catalogo, specificServices, onServiceChange }) => {
    const serviciosDisponibles = catalogo[motivo] || [];
    const valorActual = specificServices[mascota.id]?.[motivo] || '';
    if (serviciosDisponibles.length === 0) return <p className="text-sm text-gray-500">No hay servicios de {motivo} disponibles.</p>;
    const getPrecio = (servicio) => {
        if (motivo === 'clinica') return servicio.precio_base || 0;
        if (motivo === 'peluqueria') { const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico'; return servicio.precios[tamañoKey] || 0; }
        return 0;
    };
    return (
        <select value={valorActual} onChange={(e) => onServiceChange(mascota.id, motivo, e.target.value)} required className="p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>-- Elige un servicio --</option>
            {serviciosDisponibles.map(s => <option key={s.id} value={s.id}>{s.nombre} (+${getPrecio(s)})</option>)}
        </select>
    );
};

const HorarioClinicaSelector = ({ horariosDisponibles, fecha, hora, onFechaChange, onHoraChange, disabledDays, modifiers, modifiersStyles }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex justify-center">
             <DayPicker mode="single" selected={fecha} onSelect={onFechaChange} locale={es} disabled={disabledDays} modifiers={modifiers} modifiersStyles={modifiersStyles} styles={{ caption: { color: '#1d4ed8' }, head: { color: '#3b82f6'} }}/>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">Horario</label>
            {fecha ? ( horariosDisponibles.length > 0 ? ( <div className="grid grid-cols-3 gap-2"> {horariosDisponibles.map(h => ( <button key={h} type="button" onClick={() => onHoraChange(h)} className={`p-3 rounded-lg text-center font-semibold transition-all duration-200 border ${hora === h ? 'bg-blue-600 text-white shadow-lg' : 'bg-white hover:bg-blue-100'}`}>{h}</button>))} </div> ) : <div className="text-center text-yellow-700 bg-yellow-50 p-3 rounded-lg text-sm">No hay horarios disponibles para este día.</div> ) : <div className="text-center text-gray-500 bg-gray-100 p-3 rounded-lg text-sm">Elige una fecha para ver los horarios</div>}
        </div>
    </div>
);

const HorarioPeluqueriaSelector = ({ fecha, turno, onFechaChange, onTurnoChange, disabledDays, modifiers, modifiersStyles }) => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex justify-center">
             <DayPicker mode="single" selected={fecha} onSelect={onFechaChange} locale={es} disabled={disabledDays} modifiers={modifiers} modifiersStyles={modifiersStyles} styles={{ caption: { color: '#16a34a' }, head: { color: '#22c55e'} }}/>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">Turno</label>
            {fecha ? (
                <div className="flex gap-4"><button type="button" onClick={() => onTurnoChange('mañana')} className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${turno === 'mañana' ? 'border-green-500 bg-green-50' : ''}`}><FaSun /> Mañana</button><button type="button" onClick={() => onTurnoChange('tarde')} className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${turno === 'tarde' ? 'border-green-500 bg-green-50' : ''}`}><FaMoon /> Tarde</button></div>
            ) : <div className="text-center text-gray-500 bg-gray-100 p-3 rounded-lg text-sm">Elige una fecha para ver los turnos</div>}
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
export default function NuevoTurnoWizardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // Data states
    const [mascotas, setMascotas] = useState([]);
    const [catalogoServicios, setCatalogoServicios] = useState({ clinica: [], peluqueria: [] });
    const [ocupacion, setOcupacion] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [diasNoLaborales, setDiasNoLaborales] = useState([]);

    // Wizard states
    const [step, setStep] = useState(1);
    const [selectedMascotaIds, setSelectedMascotaIds] = useState([]);
    const [motivosPorMascota, setMotivosPorMascota] = useState({});
    const [specificServices, setSpecificServices] = useState({});
    const [horarioClinica, setHorarioClinica] = useState({ fecha: undefined, hora: '' });
    const [horarioPeluqueria, setHorarioPeluqueria] = useState({ fecha: undefined, turno: '' });
    const [necesitaTraslado, setNecesitaTraslado] = useState(false);
    const [metodoPago, setMetodoPago] = useState('efectivo');

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login?redirectTo=/turnos/nuevo'); return; }
        if (user) {
            const cargarDatos = async () => {
                setLoadingData(true);
                try {
                    // Cargar mascotas, catálogo y días no laborales en paralelo
                    const [mascotasSnap, serviciosSnap, diasResult] = await Promise.all([
                        getDocs(query(collection(db, 'users', user.uid, 'mascotas'), orderBy('nombre', 'asc'))),
                        getDoc(doc(db, 'servicios', 'catalogo')),
                        getDiasNoLaborales()
                    ]);

                    setMascotas(mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    
                    if (serviciosSnap.exists()) {
                        const data = serviciosSnap.data();
                        setCatalogoServicios({ clinica: Object.entries(data.clinica || {}).map(([id, val]) => ({ id, ...val })), peluqueria: Object.entries(data.peluqueria || {}).map(([id, val]) => ({ id, ...val })) });
                    }

                    if (diasResult.success) {
                        setDiasNoLaborales(diasResult.data.map(d => new Date(d)));
                    } else {
                        toast.error("No se pudo cargar la configuración de días festivos.");
                        console.error("Error al cargar días no laborales:", diasResult.error);
                    }

                } catch (err) { setError('Ocurrió un error al cargar los datos iniciales.'); console.error(err); } finally { setLoadingData(false); }
            };
            cargarDatos();
        }
    }, [user, authLoading, router]);
    
    // Lógica de fechas para los calendarios
    const disabledDays = useMemo(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0);

        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(today.getDate() + 15);
        
        return [
            ...diasNoLaborales,
            { before: tomorrow },
            { after: twoWeeksFromNow },
            { dayOfWeek: [0, 6] }
        ];
    }, [diasNoLaborales]);
    
    const modifiers = { noLaboral: diasNoLaborales };
    const modifiersStyles = { noLaboral: { color: 'white', backgroundColor: '#ef4444', borderRadius: '50%'} };

    // ... El resto de la lógica y los handlers del wizard ...
    const selectedMascotas = useMemo(() => mascotas.filter(m => selectedMascotaIds.includes(m.id)), [mascotas, selectedMascotaIds]);
    const necesitaHorarioClinica = useMemo(() => selectedMascotas.some(m => motivosPorMascota[m.id]?.clinica), [selectedMascotas, motivosPorMascota]);
    const necesitaHorarioPeluqueria = useMemo(() => selectedMascotas.some(m => motivosPorMascota[m.id]?.peluqueria), [selectedMascotas, motivosPorMascota]);

    const horariosDisponiblesClinica = useMemo(() => {
        if (!horarioClinica.fecha) return [];
        const ocupacionFecha = ocupacion[horarioClinica.fecha.toISOString().split('T')[0]] || {};
        const numTurnosClinica = selectedMascotas.filter(m => motivosPorMascota[m.id]?.clinica).length;
        return horariosConsulta.filter(h => (ocupacionFecha[h] || 0) + numTurnosClinica <= VETERINARIOS_DISPONIBLES);
    }, [horarioClinica.fecha, ocupacion, selectedMascotas, motivosPorMascota]);

    const handleNextStep = async () => {
        if (step === 4 && necesitaTraslado) {
            setIsSubmitting(true);
            const fechaPeluqueria = necesitaHorarioPeluqueria ? horarioPeluqueria.fecha : null;
            const mascotasParaTraslado = selectedMascotas.filter(m => motivosPorMascota[m.id]?.peluqueria);

            if (fechaPeluqueria && mascotasParaTraslado.length > 0) {
                 const result = await verificarDisponibilidadTrasladoAction({
                    fecha: fechaPeluqueria.toISOString().split('T')[0],
                    nuevasMascotas: mascotasParaTraslado
                });
                
                if (!result.success) {
                    toast.error(result.error);
                    setIsSubmitting(false);
                    return; 
                }
            }
            setIsSubmitting(false);
        }
        setStep(p => p + 1);
    };
    
    const handleConfirmarTurnos = async () => {
        setIsSubmitting(true);
        try {
            const result = await crearTurnos(user, {
                selectedMascotas,
                motivosPorMascota,
                specificServices,
                horarioClinica,
                horarioPeluqueria,
                necesitaTraslado,
                metodoPago,
                catalogoServicios
            });

            if (result.success) {
                toast.success('¡Turnos creados con éxito!');
                router.push('/turnos/mis-turnos');
            } else {
                throw new Error(result.error || 'Ocurrió un error desconocido.');
            }
        } catch (error) { toast.error(error.message); } finally { setIsSubmitting(false); }
    };

    const prevStep = () => setStep(p => p - 1);
    const handleMascotaToggle = (mascotaId) => {
        const newSelection = selectedMascotaIds.includes(mascotaId) ? selectedMascotaIds.filter(id => id !== mascotaId) : [...selectedMascotaIds, mascotaId];
        setSelectedMascotaIds(newSelection);
        if (!newSelection.includes(mascotaId)) {
            setMotivosPorMascota(p => { const n = {...p}; delete n[mascotaId]; return n; });
            setSpecificServices(p => { const n = {...p}; delete n[mascotaId]; return n; });
        }
    };
    const handleMotivoToggle = (mascotaId, motivo) => {
        const isTurningOn = !motivosPorMascota[mascotaId]?.[motivo];
        setMotivosPorMascota(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: isTurningOn } }));
        if (!isTurningOn) { setSpecificServices(p => { const n = {...p}; if(n[mascotaId]) delete n[mascotaId][motivo]; return n; }); }
    };
    const handleSpecificServiceChange = (mascotaId, motivo, serviceId) => {
        setSpecificServices(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: serviceId } }));
    }

    const isStep1Complete = selectedMascotaIds.length > 0;
    const isStep2Complete = isStep1Complete && selectedMascotaIds.every(id => motivosPorMascota[id] && (motivosPorMascota[id].clinica || motivosPorMascota[id].peluqueria));
    const isStep3Complete = isStep2Complete && selectedMascotas.every(m => { const mot = motivosPorMascota[m.id]||{}; const serv = specificServices[m.id]||{}; if (mot.clinica && !serv.clinica) return false; if (mot.peluqueria && !serv.peluqueria) return false; return true; });
    const isStep4Complete = isStep3Complete && (!necesitaHorarioClinica || (horarioClinica.fecha && horarioClinica.hora)) && (!necesitaHorarioPeluqueria || (horarioPeluqueria.fecha && horarioPeluqueria.turno));

    if (authLoading || loadingData) return <div className="p-12 text-center"><FaSpinner className="animate-spin text-4xl mx-auto text-blue-500" /></div>;
    if (error) return <div className="p-12 text-center text-red-500">Error: {error}</div>;
    if (user && mascotas.length === 0) return <div className="p-6 text-center"><h3 className="text-xl font-bold mb-4">No tienes mascotas registradas</h3><Link href="/mascotas/nueva" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 inline-flex items-center gap-2"><FaPlus /> Registrar Mascota</Link></div>;

    return (
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border mt-10 mb-20">
            <Toaster position="top-center" />
            <div className="p-4 sm:p-6 border-b"><button onClick={prevStep} disabled={step === 1} className="flex items-center gap-2 text-sm font-semibold text-gray-600 disabled:opacity-50"><FaArrowLeft /> Volver</button></div>

            <div className="p-6 sm:p-8 md:p-10">
                {step === 1 && <div><h2 className="text-2xl font-bold mb-2">Paso 1: ¿Para quién es el turno?</h2><p className="text-gray-600 mb-6">Puedes seleccionar una o varias mascotas.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{mascotas.map(m => <MascotaSelectionCard key={m.id} mascota={m} isSelected={selectedMascotaIds.includes(m.id)} onToggle={handleMascotaToggle} /> )}</div></div>}
                {step === 2 && <div><h2 className="text-2xl font-bold mb-8">Paso 2: Elige el motivo de la visita</h2><div className="overflow-x-auto rounded-lg border"><table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-600">Mascota</th><th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Clínica <FaStethoscope className="inline ml-1"/></th><th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Peluquería <FaCut className="inline ml-1"/></th></tr></thead><tbody>{selectedMascotas.map(mascota => <ServiceAssignmentRow key={mascota.id} mascota={mascota} services={motivosPorMascota[mascota.id] || {}} onToggle={handleMotivoToggle} /> )}</tbody></table></div></div>}
                {step === 3 && <div><h2 className="text-2xl font-bold mb-8">Paso 3: Detalla los servicios</h2><div className="space-y-8">{selectedMascotas.map(mascota => { const motivos = motivosPorMascota[mascota.id]; if (!motivos || (!motivos.clinica && !motivos.peluqueria)) return null; return (<div key={mascota.id} className="p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500"><h3 className="font-bold text-xl mb-4 text-gray-800">{mascota.nombre}</h3><div className="space-y-4"> {motivos.clinica && <div><label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FaStethoscope /> Servicio de Clínica</label><ServicioDetalleSelector mascota={mascota} motivo="clinica" catalogo={catalogoServicios} specificServices={specificServices} onServiceChange={handleSpecificServiceChange} /></div>} {motivos.peluqueria && <div><label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FaCut /> Servicio de Peluquería</label><ServicioDetalleSelector mascota={mascota} motivo="peluqueria" catalogo={catalogoServicios} specificServices={specificServices} onServiceChange={handleSpecificServiceChange} /></div>}</div></div>);})}</div></div>}
                {step === 4 && <div><h2 className="text-2xl font-bold mb-8">Paso 4: Elige los horarios y traslado</h2><div className="space-y-8">
                    {necesitaHorarioClinica && <div className="bg-gray-50 p-6 rounded-xl border"><h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3"><FaStethoscope className="text-blue-500"/>Turno de Clínica</h3><HorarioClinicaSelector horariosDisponibles={horariosDisponiblesClinica} fecha={horarioClinica.fecha} hora={horarioClinica.hora} onFechaChange={(fecha) => setHorarioClinica(p => ({ ...p, fecha, hora: '' }))} onHoraChange={(hora) => setHorarioClinica(p => ({ ...p, hora }))} disabledDays={disabledDays} modifiers={modifiers} modifiersStyles={modifiersStyles} /></div>}
                    {necesitaHorarioPeluqueria && <div className="bg-gray-50 p-6 rounded-xl border"><h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3"><FaCut className="text-green-500"/>Turno de Peluquería</h3><HorarioPeluqueriaSelector fecha={horarioPeluqueria.fecha} turno={horarioPeluqueria.turno} onFechaChange={(fecha) => setHorarioPeluqueria(p => ({ ...p, fecha, turno: ''}))} onTurnoChange={(turno) => setHorarioPeluqueria(p => ({...p, turno}))} disabledDays={disabledDays} modifiers={modifiers} modifiersStyles={modifiersStyles} /></div>}
                    <div className="p-4 border rounded-lg"><div className="flex items-center justify-between"><div className="flex items-center"><FaTruck className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">¿Necesitas traslado?</span></div><button type="button" onClick={() => setNecesitaTraslado(!necesitaTraslado)} className={`relative inline-flex items-center h-6 rounded-full w-11 ${necesitaTraslado ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full ${necesitaTraslado ? 'translate-x-6' : 'translate-x-1'}`}/></button></div></div>
                </div></div>}
                {step === 5 && <div><h2 className="text-2xl font-bold mb-8">Paso 5: Detalles Finales y Confirmación</h2><div className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="p-4 border rounded-lg"><div className="flex items-center mb-3"><FaCreditCard className="text-2xl text-gray-600 mr-3"/><span className="font-bold text-gray-700">Método de pago</span></div><div className="flex gap-4"><button type="button" onClick={() => setMetodoPago('efectivo')} className={`flex-1 p-3 rounded-lg border-2 ${metodoPago === 'efectivo' ? 'border-blue-500 bg-blue-50' : ''}`}><FaMoneyBillWave className="inline mr-2"/> Efectivo</button><button type="button" onClick={() => setMetodoPago('transferencia')} className={`flex-1 p-3 rounded-lg border-2 ${metodoPago === 'transferencia' ? 'border-blue-500 bg-blue-50' : ''}`}><FaCreditCard className="inline mr-2"/> Transferencia</button></div></div></div><div className="p-6 bg-gray-50 rounded-xl border"><h3 className="text-xl font-bold mb-4 border-b pb-2">Resumen del Turno</h3>{/* Aquí podría ir un resumen detallado */}</div></div></div>}
            </div>

            <div className="p-4 sm:p-6 border-t flex justify-end">
                 {step < 5 && <button onClick={handleNextStep} disabled={ (step === 1 && !isStep1Complete) || (step === 2 && !isStep2Complete) || (step === 3 && !isStep3Complete) || (step === 4 && !isStep4Complete) || isSubmitting } className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"> {isSubmitting ? <FaSpinner className="animate-spin"/> : 'Siguiente'} </button>}
                 {step === 5 && <button onClick={handleConfirmarTurnos} disabled={isSubmitting} className="px-8 py-3 w-full md:w-auto bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50">Confirmar Turnos</button>}
            </div>
        </section>
    );
}
