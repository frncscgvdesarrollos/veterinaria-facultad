'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { registrarMascota } from '@/app/actions/mascotasActions';
import { FaDog, FaCat, FaVenusMars, FaRulerCombined, FaPaw, FaBirthdayCake, FaTag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { razasDePerros, razasDeGatos } from '@/lib/razas.js';

// --- Componentes de UI ---
const InputField = ({ icon, label, ...props }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <input {...props} className="pl-10 block w-full bg-gray-50 border-gray-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-200" />
        </div>
    </div>
);

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

const Toggle = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700">{label}</span>
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    </div>
);

// --- Componente Principal ---
export default function FormularioNuevaMascota() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [enAdopcion, setEnAdopcion] = useState(false);

    // --- NUEVOS ESTADOS para la lógica dinámica ---
    const [especie, setEspecie] = useState('');
    const [raza, setRaza] = useState('');
    const [tamaño, setTamaño] = useState('');
    const [razasDisponibles, setRazasDisponibles] = useState([]);
    const [tamañoDeshabilitado, setTamañoDeshabilitado] = useState(true);

    // --- Efecto para actualizar la lista de razas cuando cambia la especie ---
    useEffect(() => {
        if (especie === 'perro') {
            setRazasDisponibles(razasDePerros.map(r => r.nombre));
            setTamañoDeshabilitado(true); // Se deshabilita hasta que se elija raza
        } else if (especie === 'gato') {
            setRazasDisponibles(razasDeGatos);
            setTamañoDeshabilitado(false); // Los gatos tienen tamaño manual
        } else {
            setRazasDisponibles([]);
            setTamañoDeshabilitado(true);
        }
        setRaza('');
        setTamaño('');
    }, [especie]);

    // --- Efecto para autocompletar el tamaño si es un perro ---
    useEffect(() => {
        if (especie === 'perro' && raza) {
            const razaInfo = razasDePerros.find(r => r.nombre === raza);
            if (razaInfo && razaInfo.tamaño) {
                setTamaño(razaInfo.tamaño);
                setTamañoDeshabilitado(true);
            } else {
                // Para 'Mestizo', 'Otra raza' o 'No especificada'
                setTamaño('');
                setTamañoDeshabilitado(false);
            }
        }
    }, [raza, especie]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para registrar una mascota.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Registrando mascota...');

        const formData = new FormData(event.currentTarget);
        const otraRaza = formData.get('otraRaza') || '';

        const mascotaData = {
            nombre: formData.get('nombre'),
            fechaNacimiento: formData.get('fechaNacimiento'),
            sexo: formData.get('sexo'),
            especie: especie,
            raza: raza === 'Otra raza' ? otraRaza : raza,
            tamaño: tamaño,
            enAdopcion: enAdopcion,
        };

        if (!mascotaData.nombre || !mascotaData.especie || !mascotaData.fechaNacimiento || !mascotaData.sexo || !mascotaData.tamaño || !mascotaData.raza) {
            toast.error("Por favor, completa todos los campos.", { id: toastId });
            setLoading(false);
            return;
        }

        try {
            const serializableUser = { uid: user.uid, displayName: user.displayName, email: user.email };
            const result = await registrarMascota(serializableUser, mascotaData);

            if (result.success) {
                toast.success(result.message || '¡Mascota registrada con éxito!', { id: toastId });
                router.push('/mascotas');
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
        <form onSubmit={handleSubmit} className="space-y-8 p-4 md:p-0">
            <Toaster position="top-center" reverseOrder={false} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<FaPaw />} label="Nombre" name="nombre" type="text" placeholder="Ej: Rocky" required disabled={loading} />
                <InputField icon={<FaBirthdayCake />} label="Fecha de Nacimiento" name="fechaNacimiento" type="date" required disabled={loading} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField icon={<FaDog />} label="Especie" name="especie" value={especie} onChange={(e) => setEspecie(e.target.value)} required disabled={loading}>
                    <option value="">Selecciona una especie</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                </SelectField>
                <SelectField icon={<FaVenusMars />} label="Sexo" name="sexo" required disabled={loading}>
                    <option value="">Selecciona el sexo</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                </SelectField>
            </div>

            {(especie === 'perro' || especie === 'gato') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField icon={<FaTag />} label="Raza" name="raza" value={raza} onChange={(e) => setRaza(e.target.value)} required disabled={loading || !especie}>
                        <option value="">Selecciona una raza</option>
                        {razasDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
                    </SelectField>
                    <SelectField icon={<FaRulerCombined />} label="Tamaño" name="tamaño" value={tamaño} onChange={(e) => setTamaño(e.target.value)} required disabled={loading || tamañoDeshabilitado}>
                        <option value="">Selecciona el tamaño</option>
                        <option value="pequeño">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
                    </SelectField>
                </div>
            )}

            {raza === 'Otra raza' && (
                <InputField icon={<FaTag />} label="Especifica la raza" name="otraRaza" type="text" placeholder="Ej: Bulldog Inglés" required disabled={loading} />
            )}
            
            {especie === 'otro' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField icon={<FaTag />} label="Raza/Tipo" name="raza" type="text" placeholder="Ej: Conejo Belier" required disabled={loading} />
                    <SelectField icon={<FaRulerCombined />} label="Tamaño" name="tamaño" value={tamaño} onChange={(e) => setTamaño(e.target.value)} required disabled={loading}>
                        <option value="">Selecciona el tamaño</option>
                        <option value="pequeño">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
                    </SelectField>
                </div>
            )}

            <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
                 <Toggle label="¿Está disponible para adopción?" enabled={enAdopcion} setEnabled={setEnAdopcion} />
            </div>

            <div className="pt-5">
                <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:scale-105">
                    {loading ? 'Guardando...' : 'Registrar Mascota'}
                </button>
            </div>
        </form>
    );
}
