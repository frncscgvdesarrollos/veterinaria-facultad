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

    const [especie, setEspecie] = useState('');
    const [raza, setRaza] = useState('');
    const [tamaño, setTamaño] = useState('');
    const [sexo, setSexo] = useState('');

    const [razasDisponibles, setRazasDisponibles] = useState([]);
    const [isTamañoManual, setIsTamañoManual] = useState(false);

    // Efecto para actualizar la lista de razas cuando cambia la especie
    useEffect(() => {
        if (especie === 'perro') {
            setRazasDisponibles(razasDePerros.map(r => r.nombre));
        } else if (especie === 'gato') {
            setRazasDisponibles(razasDeGatos);
        } else {
            setRazasDisponibles([]);
        }
        // Resetear campos dependientes
        setRaza('');
        setTamaño('');
        setIsTamañoManual(false);
    }, [especie]);

    // Efecto para gestionar la lógica del tamaño cuando cambia la raza (para perros)
    useEffect(() => {
        if (especie === 'perro' && raza) {
            const infoRaza = razasDePerros.find(r => r.nombre === raza);
            if (infoRaza && infoRaza.tamaño) {
                // Si la raza tiene un tamaño definido (ej. Labrador), se autocompleta y bloquea
                setTamaño(infoRaza.tamaño);
                setIsTamañoManual(false);
            } else {
                // Si es Mestizo, Otra Raza, o No especificada, se habilita para el usuario
                setTamaño('');
                setIsTamañoManual(true);
            }
        } else if (especie === 'gato') {
            // Para los gatos, el tamaño siempre es manual
            setIsTamañoManual(true);
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
        const nombre = formData.get('nombre');
        const fechaNacimiento = formData.get('fechaNacimiento');
        const otraRaza = formData.get('otraRaza') || '';

        const mascotaData = {
            nombre: nombre,
            fechaNacimiento: fechaNacimiento,
            sexo: sexo,
            especie: especie,
            raza: raza === 'Otra raza' ? otraRaza : raza,
            tamaño: tamaño,
            enAdopcion: enAdopcion,
        };

        if (!nombre || !especie || !fechaNacimiento || !sexo || !tamaño || !raza) {
            toast.error("Por favor, completa todos los campos obligatorios.", { id: toastId });
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
                 <SelectField icon={<FaVenusMars />} label="Sexo" name="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required disabled={loading}>
                    <option value="">Selecciona el sexo</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                </SelectField>
                <SelectField icon={<FaDog />} label="Especie" name="especie" value={especie} onChange={(e) => setEspecie(e.target.value)} required disabled={loading}>
                    <option value="">Selecciona una especie</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                </SelectField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField icon={<FaTag />} label="Raza" name="raza" value={raza} onChange={(e) => setRaza(e.target.value)} required disabled={loading || !especie}>
                    <option value="">Selecciona una raza</option>
                    {razasDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
                </SelectField>
                <SelectField icon={<FaRulerCombined />} label="Tamaño" name="tamaño" value={tamaño} onChange={(e) => setTamaño(e.target.value)} required disabled={loading || !isTamañoManual}>
                    <option value="">Selecciona el tamaño</option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                </SelectField>
            </div>

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
