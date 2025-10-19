'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaDog, FaCat, FaArrowLeft, FaCut, FaStethoscope, FaCalendarAlt, FaClock, FaSpinner, FaCheck, FaPlus, FaMoneyBillWave } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

// --- CONFIG & CONSTANTS ---
const hoy = new Date().toISOString().split('T')[0];
const TAMAÑO_PRECIOS_MAP = { 'pequeño': 'chico', 'mediano': 'mediano', 'grande': 'grande' };

// --- WIZARD SUB-COMPONENTS ---

const MascotaSelectionCard = ({ mascota, isSelected, onToggle }) => (
    <div onClick={() => onToggle(mascota.id)} className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${isSelected ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white dark:bg-gray-700 hover:bg-gray-50'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}><{isSelected && <FaCheck className="text-white text-xs"/>}</div>
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

    if (serviciosDisponibles.length === 0) {
        return <p className="text-sm text-gray-500">No hay servicios de {motivo} disponibles.</p>;
    }

    const getPrecio = (servicio) => {
        if (motivo === 'clinica') {
            return servicio.precio_base || 0;
        } else if (motivo === 'peluqueria') {
            const tamañoKey = TAMAÑO_PRECIOS_MAP[mascota.tamaño.toLowerCase()] || 'chico';
            return servicio.precios[tamañoKey] || 0;
        }
        return 0;
    };

    return (
        <select value={valorActual} onChange={(e) => onServiceChange(mascota.id, motivo, e.target.value)} required className="p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>-- Elige un servicio --</option>
            {serviciosDisponibles.map(s => (
                <option key={s.id} value={s.id}>{s.nombre} (+${getPrecio(s)})</option>
            ))}
        </select>
    );
};


// --- MAIN PAGE COMPONENT ---

export default function NuevoTurnoWizardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // Data states
    const [mascotas, setMascotas] = useState([]);
    const [catalogoServicios, setCatalogoServicios] = useState({ clinica: [], peluqueria: [] });
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Wizard states
    const [step, setStep] = useState(1);
    const [selectedMascotaIds, setSelectedMascotaIds] = useState([]);
    const [motivosPorMascota, setMotivosPorMascota] = useState({}); // { mascotaId: { clinica: bool, peluqueria: bool } }
    const [specificServices, setSpecificServices] = useState({}); // { mascotaId: { clinica: 'service_id', peluqueria: 'service_id' } }

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
                    setMascotas(mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    
                    const serviciosSnap = await getDoc(doc(db, 'servicios', 'catalogo'));
                    if (serviciosSnap.exists()) {
                        const data = serviciosSnap.data();
                        setCatalogoServicios({
                            clinica: Object.entries(data.clinica || {}).map(([id, val]) => ({ id, ...val })),
                            peluqueria: Object.entries(data.peluqueria || {}).map(([id, val]) => ({ id, ...val }))
                        });
                    }
                } catch (err) {
                    setError('Ocurrió un error al cargar los datos.');
                } finally {
                    setLoadingData(false);
                }
            };
            cargarDatos();
        }
    }, [user, authLoading, router]);

    const selectedMascotas = useMemo(() => mascotas.filter(m => selectedMascotaIds.includes(m.id)), [mascotas, selectedMascotaIds]);

    const nextStep = () => setStep(p => p + 1);
    const prevStep = () => setStep(p => p - 1);

    const handleMascotaToggle = (mascotaId) => {
        const newSelection = selectedMascotaIds.includes(mascotaId) ? selectedMascotaIds.filter(id => id !== mascotaId) : [...selectedMascotaIds, mascotaId];
        setSelectedMascotaIds(newSelection);
        // Clean up states if a pet is deselected
        if (!newSelection.includes(mascotaId)) {
            setMotivosPorMascota(p => { const n = {...p}; delete n[mascotaId]; return n; });
            setSpecificServices(p => { const n = {...p}; delete n[mascotaId]; return n; });
        }
    };
    
    const handleMotivoToggle = (mascotaId, motivo) => {
        const isTurningOn = !motivosPorMascota[mascotaId]?.[motivo];
        setMotivosPorMascota(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: isTurningOn } }));
        // Clean up specific service if motivo is turned off
        if (!isTurningOn) {
            setSpecificServices(p => { const n = {...p}; if(n[mascotaId]) delete n[mascotaId][motivo]; return n; });
        }
    };

    const handleSpecificServiceChange = (mascotaId, motivo, serviceId) => {
        setSpecificServices(p => ({ ...p, [mascotaId]: { ...p[mascotaId], [motivo]: serviceId } }));
    }

    const isStep1Complete = selectedMascotaIds.length > 0;
    const isStep2Complete = isStep1Complete && selectedMascotaIds.every(id => motivosPorMascota[id] && (motivosPorMascota[id].clinica || motivosPorMascota[id].peluqueria));
    const isStep3Complete = isStep2Complete && selectedMascotas.every(mascota => {
        const motivos = motivosPorMascota[mascota.id] || {};
        const servicios = specificServices[mascota.id] || {};
        if (motivos.clinica && !servicios.clinica) return false;
        if (motivos.peluqueria && !servicios.peluqueria) return false;
        return true;
    });

    if (authLoading || loadingData) return <div className="p-12 text-center"><FaSpinner className="animate-spin text-4xl mx-auto text-blue-500" /></div>;
    if (error) return <div className="p-12 text-center text-red-500">Error: {error}</div>;
    if (user && mascotas.length === 0) return (
        <div className="p-6 text-center"><h3 className="text-xl font-bold mb-4">No tienes mascotas registradas</h3><Link href="/mascotas/nueva" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 inline-flex items-center gap-2"><FaPlus /> Registrar Mascota</Link></div>
    );

    return (
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border mt-10 mb-20">
            <Toaster position="top-center" />
            <div className="p-4 sm:p-6 border-b"><button onClick={prevStep} disabled={step === 1} className="flex items-center gap-2 text-sm font-semibold text-gray-600 disabled:opacity-50"><FaArrowLeft /> Volver</button></div>

            <div className="p-6 sm:p-8 md:p-10">
                {step === 1 && (
                    <div><h2 className="text-2xl font-bold mb-2">Paso 1: ¿Para quién es el turno?</h2><p className="text-gray-600 mb-6">Puedes seleccionar una o varias mascotas.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{mascotas.map(m => <MascotaSelectionCard key={m.id} mascota={m} isSelected={selectedMascotaIds.includes(m.id)} onToggle={handleMascotaToggle} /> )}</div></div>
                )}

                {step === 2 && (
                    <div><h2 className="text-2xl font-bold mb-8">Paso 2: Elige el motivo de la visita</h2><div className="overflow-x-auto rounded-lg border"><table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-600">Mascota</th><th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Clínica <FaStethoscope className="inline ml-1"/></th><th className="py-3 px-2 text-center text-sm font-semibold text-gray-600">Peluquería <FaCut className="inline ml-1"/></th></tr></thead><tbody>{selectedMascotas.map(mascota => <ServiceAssignmentRow key={mascota.id} mascota={mascota} services={motivosPorMascota[mascota.id] || {}} onToggle={handleMotivoToggle} /> )}</tbody></table></div></div>
                )}
                
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-8">Paso 3: Detalla los servicios</h2>
                        <div className="space-y-8">
                            {selectedMascotas.map(mascota => {
                                const motivos = motivosPorMascota[mascota.id];
                                if (!motivos || (!motivos.clinica && !motivos.peluqueria)) return null;

                                return (
                                    <div key={mascota.id} className="p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                                        <h3 className="font-bold text-xl mb-4 text-gray-800">{mascota.nombre}</h3>
                                        <div className="space-y-4">
                                            {motivos.clinica && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FaStethoscope /> Servicio de Clínica</label>
                                                    <ServicioDetalleSelector mascota={mascota} motivo="clinica" catalogo={catalogoServicios} specificServices={specificServices} onServiceChange={handleSpecificServiceChange} />
                                                </div>
                                            )}
                                            {motivos.peluqueria && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><FaCut /> Servicio de Peluquería</label>
                                                     <ServicioDetalleSelector mascota={mascota} motivo="peluqueria" catalogo={catalogoServicios} specificServices={specificServices} onServiceChange={handleSpecificServiceChange} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                 {step > 3 && (
                    <div><h2 className="text-2xl font-bold mb-8">Próximos Pasos</h2><p>Aquí configurarás la fecha y hora.</p><pre className="bg-gray-100 p-4 rounded-lg mt-4 text-sm">{JSON.stringify({motivosPorMascota, specificServices}, null, 2)}</pre></div>
                )}
            </div>

            <div className="p-4 sm:p-6 border-t flex justify-end">
                 {step < 4 && (
                    <button onClick={nextStep} disabled={ (step === 1 && !isStep1Complete) || (step === 2 && !isStep2Complete) || (step === 3 && !isStep3Complete) } className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">
                        Siguiente
                    </button>
                )}
                 {step === 4 && (
                    <button onClick={() => {}} className="px-8 py-3 w-full md:w-auto bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700">Confirmar</button>
                )}
            </div>
        </section>
    );
}
