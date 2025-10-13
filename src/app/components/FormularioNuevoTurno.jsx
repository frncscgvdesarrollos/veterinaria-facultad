'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { solicitarTurno } from '@/app/actions/turnosActions';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaPaw, FaCalendarAlt, FaClock, FaNotesMedical, FaTruck } from 'react-icons/fa';

// --- Componentes de UI Reutilizables ---
const SelectField = ({ icon, label, children, ...props }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <select {...props} className="pl-10 block w-full bg-gray-50 border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-200">
                {children}
            </select>
        </div>
    </div>
);

const InputField = ({ icon, label, ...props }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <input {...props} className="pl-10 block w-full bg-gray-50 border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-200" />
        </div>
    </div>
);

const Toggle = ({ icon, label, enabled, setEnabled, disabled }) => (
    <div className={`flex items-center justify-between bg-indigo-50 p-4 rounded-lg shadow-inner ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center">
            <div className="text-gray-400 mr-3">{icon}</div>
            <span className="font-bold text-gray-700">{label}</span>
        </div>
        <button
            type="button"
            onClick={() => !disabled && setEnabled(!enabled)}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed' : ''}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    </div>
);

// --- Componente Principal ---
export default function FormularioNuevoTurno() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mascotas, setMascotas] = useState([]);
    const [selectedMascota, setSelectedMascota] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('clínica');
    const [necesitaTransporte, setNecesitaTransporte] = useState(false);

    // Cargar las mascotas del usuario
    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchMascotas = async () => {
                try {
                    const mascotasRef = collection(db, 'users', user.uid, 'mascotas');
                    const q = query(mascotasRef, orderBy('nombre'));
                    const querySnapshot = await getDocs(q);
                    const mascotasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMascotas(mascotasData);
                } catch (error) {
                    toast.error("No se pudieron cargar tus mascotas.");
                }
                finally {
                    setLoading(false)
                }
            };
            fetchMascotas();
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para solicitar un turno.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Procesando solicitud...');

        const formData = new FormData(event.currentTarget);
        const fecha = formData.get('fecha');
        const hora = formData.get('hora');

        const turnoData = {
            mascotaId: selectedMascota,
            fecha: fecha,
            hora: hora,
            tipo: tipoConsulta,
            transporte: necesitaTransporte,
        };
        
        try {
            const result = await solicitarTurno(turnoData);

            if (result.success) {
                toast.success('¡Turno solicitado con éxito!', { id: toastId });
                router.push('/turnos/mis-turnos');
            } else {
                throw new Error(result.error || 'Ocurrió un error inesperado.');
            }
        } catch (err) {
            toast.error(err.message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Toaster position="top-center" reverseOrder={false} />

            <SelectField 
                icon={<FaPaw />} 
                label="Mascota"
                name="mascota"
                value={selectedMascota}
                onChange={e => setSelectedMascota(e.target.value)} 
                required 
                disabled={loading || mascotas.length === 0}
            >
                <option value="">{mascotas.length === 0 ? (loading ? 'Cargando mascotas...': 'Primero registra una mascota') : 'Selecciona una mascota'}</option>
                {mascotas.map(mascota => (
                    <option key={mascota.id} value={mascota.id}>{mascota.nombre}</option>
                ))}
            </SelectField>

            <SelectField 
                icon={<FaNotesMedical />} 
                label="Tipo de Consulta"
                name="tipo"
                value={tipoConsulta}
                onChange={e => setTipoConsulta(e.target.value)}
                required 
                disabled={loading}
            >
                <option value="clínica">Consulta Clínica</option>
                <option value="peluqueria">Peluquería</option>
                <option value="vacunacion">Vacunación</option>
                <option value="urgencia">Urgencia</option>
            </SelectField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<FaCalendarAlt />} label="Fecha" name="fecha" type="date" required disabled={loading} min={new Date().toISOString().split('T')[0]}/>
                <InputField icon={<FaClock />} label="Hora" name="hora" type="time" required disabled={loading} />
            </div>

            <Toggle 
                icon={<FaTruck/>}
                label="¿Necesitas servicio de transporte?" 
                enabled={necesitaTransporte} 
                setEnabled={setNecesitaTransporte} 
                disabled={loading}
            />

            <div className="pt-5">
                <button type="submit" disabled={loading || mascotas.length === 0} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:scale-105">
                    {loading ? 'Enviando Solicitud...' : 'Confirmar Turno'}
                </button>
            </div>
        </form>
    );
}
