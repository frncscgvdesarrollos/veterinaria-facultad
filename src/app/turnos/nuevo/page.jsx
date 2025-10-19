
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { crearTurnosPeluqueria, solicitarTurno } from '@/lib/actions/turnos.actions.js';
import { FaDog, FaCat, FaArrowLeft, FaCut, FaStethoscope, FaCalendarAlt, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const VETERINARIOS_DISPONIBLES = 2;
const horariosConsulta = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '15:00', '15:30', '16:00'
];
const horariosPeluqueria = [ '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00' ];

const MascotaSelectionCard = ({ mascota, isSelected, onSelect }) => (
    <div 
        onClick={() => onSelect(mascota)}
        className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white dark:bg-gray-700 hover:bg-gray-50'}`}
    >
        <div className="flex items-center">
            {mascota.especie.toLowerCase() === 'perro' ? <FaDog className={`text-3xl mr-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} /> : <FaCat className={`text-3xl mr-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />}
            <div>
                <p className="font-bold text-lg">{mascota.nombre}</p>
                <p className="text-sm text-gray-600">{mascota.raza}</p>
            </div>
            {isSelected && <FaCheckCircle className="ml-auto text-blue-500 text-2xl" />}
        </div>
    </div>
);

const ServiceSelectionCard = ({ title, icon, isDisabled, isSelected, onSelect }) => (
    <div
        onClick={() => !isDisabled && onSelect()}
        className={`p-6 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 ${
            isDisabled 
                ? 'bg-gray-100 border-gray-200 text-gray-400' 
                : isSelected 
                    ? 'bg-blue-50 border-blue-500 shadow-lg' 
                    : 'bg-white hover:bg-gray-50'
        }`}
    >
        {icon}
        <p className={`font-bold text-lg mt-2 ${isDisabled ? '' : 'text-gray-800'}`}>{title}</p>
        {isDisabled && <p className="text-xs">(Solo para perros)</p>}
    </div>
);

export default function NuevoTurnoWizardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // Data states
    const [mascotas, setMascotas] = useState([]);
    const [serviciosPeluqueria, setServiciosPeluqueria] = useState([]);
    const [ocupacion, setOcupacion] = useState({});
    
    // Loading and error states
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Wizard states
    const [step, setStep] = useState(1);
    const [selectedMascota, setSelectedMascota] = useState(null);
    const [selectedService, setSelectedService] = useState(null); // 'veterinaria' or 'peluqueria'
    
    // Form states
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [servicioPeluqueriaId, setServicioPeluqueriaId] = useState('');

    // Fetch initial data
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirectTo=/turnos/nuevo');
            return;
        }
        if (user) {
            const cargarDatos = async () => {
                setLoadingData(true);
                try {
                    const mascotasSnap = await getDocs(query(collection(db, 'users', user.uid, 'mascotas'), orderBy('nombre', 'asc')));
                    const mascotasData = mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMascotas(mascotasData);

                    const serviciosSnap = await getDoc(doc(db, 'servicios', 'catalogo'));
                    if (serviciosSnap.exists()) {
                        setServiciosPeluqueria(Object.entries(serviciosSnap.data().peluqueria || {}).map(([id, val]) => ({ id, ...val })));
                    }
                    
                    // Suponiendo que la ocupación se obtiene de alguna forma
                    // const ocupacionData = await getOcupacion();
                    // setOcupacion(ocupacionData);

                } catch (err) {
                    setError('Ocurrió un error al cargar los datos.');
                    toast.error('Ocurrió un error al cargar los datos.');
                } finally {
                    setLoadingData(false);
                }
            };
            cargarDatos();
        }
    }, [user, authLoading, router]);

    // Derived state
    const horariosDisponibles = useMemo(() => {
        if (!fecha || !selectedService) return [];
        
        const ocupacionFecha = ocupacion[fecha] || {};
        const horariosBase = selectedService === 'veterinaria' ? horariosConsulta : horariosPeluqueria;
        const maxCupos = selectedService === 'veterinaria' ? VETERINARIOS_DISPONIBLES : 1;

        return horariosBase.filter(h => (ocupacionFecha[h] || 0) < maxCupos);
    }, [fecha, selectedService, ocupacion]);
    
    // Navigation handlers
    const nextStep = () => setStep(p => p + 1);
    const prevStep = () => {
        if (step > 1) {
            setStep(p => p - 1);
        } else {
            router.back();
        }
    };

    // Selection handlers
    const handleMascotaSelect = (mascota) => {
        setSelectedMascota(mascota);
        setSelectedService(null); // Reset service selection
        nextStep();
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        // Reset subsequent selections
        setFecha('');
        setHora('');
        setServicioPeluqueriaId('');
        nextStep();
    };

    // Form validation
    const isStep1Complete = !!selectedMascota;
    const isStep2Complete = !!selectedService;
    const isStep3Complete = useMemo(() => {
        if (!fecha || !hora) return false;
        if (selectedService === 'peluqueria' && !servicioPeluqueriaId) return false;
        return true;
    }, [fecha, hora, selectedService, servicioPeluqueriaId]);

    // Submit handler
    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Reservando turno...');

        const turnoData = {
            mascotaId: selectedMascota.id,
            fecha,
            hora,
            tipo: selectedService,
            // Agrega más detalles si son necesarios
        };
        
        // Si es peluquería, podrías necesitar más info como el servicio específico
        if (selectedService === 'peluqueria') {
            turnoData.servicioPeluqueriaId = servicioPeluqueriaId;
        }
        
        try {
            // Usar una server action unificada sería ideal
            const result = await solicitarTurno(turnoData);
            if (result.error) throw new Error(result.error);
            
            toast.success('¡Turno reservado con éxito!', { id: toastId });
            router.push('/turnos/mis-turnos');

        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Render logic
    if (authLoading || loadingData) {
        return <div className="p-12 text-center"><FaSpinner className="animate-spin text-4xl mx-auto" /></div>;
    }

    if (error) {
        return <div className="p-12 text-center text-red-500">Error: {error}</div>;
    }
    
    if (user && mascotas.length === 0) {
        return (
            <div className="p-6 text-center">
                <h3>No tienes mascotas registradas.</h3>
                <Link href="/mascotas/nueva" className="text-blue-500 hover:underline">Registra una nueva mascota</Link>
            </div>
        );
    }

    return (
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border mt-10 mb-20">
            <Toaster position="top-center" />
            <div className="p-4 sm:p-6 border-b">
                <button onClick={prevStep} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FaArrowLeft /> Volver
                </button>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
                {/* Step 1: Select Pet */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-8">Paso 1: Selecciona tu mascota</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mascotas.map(m => (
                                <MascotaSelectionCard 
                                    key={m.id} 
                                    mascota={m}
                                    isSelected={selectedMascota?.id === m.id}
                                    onSelect={handleMascotaSelect}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Service */}
                {step === 2 && selectedMascota && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Paso 2: Elige el servicio</h2>
                        <p className="text-gray-600 mb-8">Turno para: <span className="font-bold">{selectedMascota.nombre}</span></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ServiceSelectionCard 
                                title="Consulta Veterinaria"
                                icon={<FaStethoscope className="text-4xl mx-auto text-blue-500"/>}
                                isSelected={selectedService === 'veterinaria'}
                                onSelect={() => handleServiceSelect('veterinaria')}
                            />
                            <ServiceSelectionCard 
                                title="Peluquería"
                                icon={<FaCut className="text-4xl mx-auto text-green-500"/>}
                                isSelected={selectedService === 'peluqueria'}
                                onSelect={() => handleServiceSelect('peluqueria')}
                                isDisabled={selectedMascota.especie.toLowerCase() !== 'perro'}
                            />
                        </div>
                    </div>
                )}
                
                {/* Step 3: Service Details & Schedule */}
                {step === 3 && selectedService && (
                     <div>
                        <h2 className="text-2xl font-bold mb-8">Paso 3: Elige los detalles y el horario</h2>
                        {selectedService === 'peluqueria' && (
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Peluquería</label>
                                <select 
                                    value={servicioPeluqueriaId}
                                    onChange={(e) => setServicioPeluqueriaId(e.target.value)}
                                    className="pl-4 pr-10 py-3 w-full bg-white border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="" disabled>-- Elige un servicio de peluquería --</option>
                                    {serviciosPeluqueria.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Día</label>
                                <FaCalendarAlt className="absolute top-12 left-3 text-gray-400" />
                                <input 
                                    type="date" 
                                    value={fecha} 
                                    onChange={e => { setFecha(e.target.value); setHora(''); }} 
                                    required 
                                    className="p-3 pl-10 w-full bg-white border rounded-lg" 
                                    min={new Date().toISOString().split('T')[0]} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Horario</label>
                                {fecha ? (
                                    horariosDisponibles.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {horariosDisponibles.map(h => (
                                                <button key={h} type="button" onClick={() => setHora(h)}
                                                    className={`p-3 rounded-lg text-center font-semibold transition-all duration-200 border ${
                                                        hora === h 
                                                        ? 'bg-blue-600 text-white shadow-lg' 
                                                        : 'bg-gray-100 hover:bg-blue-100'
                                                    }`}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                    ) : <p className="text-center text-yellow-700 bg-yellow-50 p-3 rounded-lg">No hay horarios disponibles.</p>
                                ) : <p className="text-center text-gray-500 bg-gray-50 p-3 rounded-lg">Elige una fecha</p>}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Step 4: Confirmation */}
                {step === 4 && (
                    <div>
                         <h2 className="text-2xl font-bold mb-6">Paso 4: Confirma tu turno</h2>
                         <div className="p-6 bg-gray-50 rounded-xl border space-y-3">
                            <p><strong>Mascota:</strong> {selectedMascota.nombre}</p>
                            <p><strong>Servicio:</strong> <span className="capitalize">{selectedService}</span></p>
                             {selectedService === 'peluqueria' && servicioPeluqueriaId && (
                                <p><strong>Tipo:</strong> {serviciosPeluqueria.find(s => s.id === servicioPeluqueriaId)?.nombre}</p>
                             )}
                            <p><strong>Fecha y Hora:</strong> {new Date(fecha + 'T' + hora).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {hora} hs</p>
                         </div>
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-6 border-t flex justify-end">
                {step < 4 && (
                    <button 
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !isStep1Complete) ||
                            (step === 2 && !isStep2Complete) ||
                            (step === 3 && !isStep3Complete)
                        }
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                )}
                {step === 4 && (
                    <button onClick={handleFinalSubmit} disabled={isSubmitting} className="px-8 py-3 w-full md:w-auto bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg">
                        {isSubmitting ? <><FaSpinner className="animate-spin"/> Procesando...</> : 'Confirmar y Reservar'}
                    </button>
                )}
            </div>
        </section>
    );
}

