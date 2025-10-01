'use client';

import { useEffect, useState, use, useTransition } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import SubHeader from '@/app/components/SubHeader';
import { FaSyringe, FaCalendarAlt, FaPlus, FaFileMedical, FaDog, FaCut, FaClinicMedical, FaInfoCircle, FaTimes, FaEyeSlash, FaDeaf, FaWheelchair, FaWeight, FaPaw, FaHistory, FaBookMedical } from 'react-icons/fa';

import { addCarnetEntry, updateMascotaFicha } from './actions';

// --- COMPONENTES DE DISEÑO --- //

const TabButton = ({ icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-t-lg border-b-4 transition-colors duration-300 ${isActive ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);

const CarnetEntryCard = ({ entry }) => {
    const formatDate = (timestamp) => timestamp?.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Fecha no disponible';

    const typeInfo = {
        'Visita Clínica': { icon: <FaClinicMedical/>, color: 'blue' },
        'Peluquería': { icon: <FaCut/>, color: 'purple' },
        'Vacunación': { icon: <FaSyringe/>, color: 'green' },
        'Otro': { icon: <FaInfoCircle/>, color: 'yellow' },
        'default': { icon: <FaDog/>, color: 'gray' },
    };
    const { icon, color } = typeInfo[entry.tipo] || typeInfo.default;

    return (
        <div className={`bg-white shadow-md rounded-lg p-5 flex items-start space-x-4 border-l-4 border-${color}-500 transform hover:scale-105 transition-transform`}>
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>{icon}</div>
            <div className="flex-grow">
                <p className="font-bold text-lg text-gray-800">{entry.tipo}</p>
                <p className="text-gray-600">{entry.descripcion}</p>
                <div className="text-sm text-gray-400 mt-2 flex items-center"><FaCalendarAlt className="mr-2" /><span>{formatDate(entry.fechaCreacion)}</span></div>
            </div>
        </div>
    );
};

const EmptyState = ({ title, message, icon }) => (
    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md">
        {icon}
        <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-500">{message}</p>
    </div>
);


// --- PESTAÑAS / SECCIONES --- //

const HistorialVisitas = ({ entries }) => {
    if (entries.length === 0) {
        return <EmptyState title="Sin Visitas Registradas" message="Aún no se han registrado visitas a la clínica o peluquería." icon={<FaHistory className="mx-auto h-16 w-16 text-gray-400" />}/>
    }
    return <div className="space-y-6">{entries.map(e => <CarnetEntryCard key={e.id} entry={e} />)}</div>;
};

const HistorialVacunas = ({ entries }) => {
    const formatDate = (timestamp) => timestamp?.toDate().toLocaleDateString('es-ES') || 'N/A';

    if (entries.length === 0) {
        return <EmptyState title="Sin Vacunas Registradas" message="No hay vacunas en el historial. ¡Añade la primera!" icon={<FaSyringe className="mx-auto h-16 w-16 text-gray-400" />}/>
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacuna / Descripción</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Aplicación</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.descripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.fechaCreacion)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const FichaCompleta = ({ mascota, onUpdate }) => {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (data) => {
        startTransition(() => {
            onUpdate(data);
        });
    };

    const InfoPill = ({ icon, label, active, onClick }) => (
        <button onClick={onClick} disabled={isPending} className={`flex items-center justify-center text-center w-full p-3 rounded-full text-sm font-semibold transition ${active ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} disabled:opacity-50`}>
            {icon} <span className="ml-2">{label}</span>
        </button>
    );

    return (
        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Características de Salud</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoPill icon={<FaEyeSlash/>} label="Ceguera" active={mascota.esCiego} onClick={() => handleUpdate({ esCiego: !mascota.esCiego })} />
                    <InfoPill icon={<FaDeaf/>} label="Sordera" active={mascota.esSordo} onClick={() => handleUpdate({ esSordo: !mascota.esSordo })} />
                    <InfoPill icon={<FaWheelchair/>} label="Movilidad Reducida" active={mascota.movilidadReducida} onClick={() => handleUpdate({ movilidadReducida: !mascota.movilidadReducida })} />
                    <InfoPill icon={<FaWeight/>} label="Obesidad" active={mascota.esObeso} onClick={() => handleUpdate({ esObeso: !mascota.esObeso })} />
                </div>
            </div>
             <div className="border-t pt-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Notas Adicionales</h3>
                 <textarea 
                    defaultValue={mascota.notas}
                    onBlur={(e) => handleUpdate({ notas: e.target.value })}
                    disabled={isPending}
                    rows="4"
                    className="w-full text-gray-700 mt-1 p-3 bg-gray-50 rounded-md border focus:border-blue-500 focus:ring focus:ring-blue-200 transition disabled:opacity-50"
                    placeholder='Anotaciones importantes sobre la mascota (alergias, medicación, comportamiento...)'
                />
             </div>
        </div>
    );
};

// --- MODAL (sin cambios) --- //
const AddEntryModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;
    const [tipo, setTipo] = useState('Visita Clínica');
    const [descripcion, setDescripcion] = useState('');
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!descripcion) return alert("La descripción es obligatoria.");
        startTransition(() => { 
            onSubmit({ tipo, descripcion });
            onClose();
        });
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Añadir al Carnet</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes size={24} /></button></div><form onSubmit={handleSubmit}><div className="mb-4"><label htmlFor="tipo" className="block text-gray-700 font-semibold mb-2">Tipo de Registro</label><select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-3 border rounded-md bg-gray-50"><option>Visita Clínica</option><option>Peluquería</option><option>Vacunación</option><option>Otro</option></select></div><div className="mb-6"><label htmlFor="descripcion" className="block text-gray-700 font-semibold mb-2">Descripción</label><textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" className="w-full p-3 border rounded-md" placeholder="Ej: Vacuna anual de la rabia"></textarea></div><button type="submit" disabled={isPending} className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold disabled:bg-blue-300">{isPending ? 'Guardando...' : 'Guardar Registro'}</button></form></div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA --- //
export default function CarnetSanitarioPage({ params }) {
    const { mascotaId } = use(params);
    const { user } = useAuth();
    
    const [mascota, setMascota] = useState(null);
    const [carnet, setCarnet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('visitas');
    const [isPending, startTransition] = useTransition();

    const fetchData = async () => {
        if (!user?.uid || !mascotaId) return;
        if (!loading) setLoading(true);
        try {
            const mascotaRef = doc(db, 'users', user.uid, 'mascotas', mascotaId);
            const mascotaSnap = await getDoc(mascotaRef);
            if (mascotaSnap.exists()) setMascota({ id: mascotaSnap.id, ...mascotaSnap.data() });
            else throw new Error("No se encontró la mascota.");

            const carnetRef = collection(mascotaRef, 'carnetSanitario');
            const q = query(carnetRef, orderBy('fechaCreacion', 'desc'));
            const carnetSnapshot = await getDocs(q);
            setCarnet(carnetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [user, mascotaId]);

    const handleAddEntry = (data) => {
        startTransition(async () => {
            await addCarnetEntry(user.uid, mascotaId, data);
            fetchData(); 
        });
    };
    
    const handleFichaUpdate = (data) => {
        startTransition(async () => {
            await updateMascotaFicha(user.uid, mascotaId, data);
            fetchData();
        });
    };
    
    const visitas = carnet.filter(e => ['Visita Clínica', 'Peluquería', 'Otro'].includes(e.tipo));
    const vacunas = carnet.filter(e => e.tipo === 'Vacunación');

    return (
        <>
            <SubHeader title={mascota ? `Carnet de ${mascota.nombre}` : 'Cargando Carnet...'} />
            <main className="max-w-5xl mx-auto p-4 md:p-8">
                <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEntry} />

                <div className="flex justify-between items-center mb-6">
                    <div className="flex border-b border-gray-200">
                        <TabButton icon={<FaHistory/>} label="Historial de Visitas" isActive={activeTab === 'visitas'} onClick={() => setActiveTab('visitas')} />
                        <TabButton icon={<FaSyringe/>} label="Vacunas" isActive={activeTab === 'vacunas'} onClick={() => setActiveTab('vacunas')} />
                        <TabButton icon={<FaPaw/>} label="Ficha Completa" isActive={activeTab === 'ficha'} onClick={() => setActiveTab('ficha')} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-green-500 text-white py-2 px-5 rounded-lg hover:bg-green-600 transition shadow-lg">
                        <FaPlus className="mr-2" />
                        <span className="hidden md:inline">Añadir Registro</span>
                    </button>
                </div>
                
                {loading && <div className="text-center text-gray-500 py-10">Cargando...</div>}
                {error && <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg">Error: {error}</div>}
                
                {!loading && !error && mascota && (
                    <div className="mt-8">
                        {activeTab === 'visitas' && <HistorialVisitas entries={visitas} />}
                        {activeTab === 'vacunas' && <HistorialVacunas entries={vacunas} />}
                        {activeTab === 'ficha' && <FichaCompleta mascota={mascota} onUpdate={handleFichaUpdate} />}
                    </div>
                )}
            </main>
        </>
    );
}
