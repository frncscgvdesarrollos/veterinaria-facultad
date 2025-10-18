// Historia de Usuario 6: Completar Perfil de Usuario - Versión Rediseñada

'use client';

import { useState, useTransition, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { completarPerfil } from '@/lib/actions/user.actions.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';


const FormInput = ({ id, name, type, placeholder, value, onChange, required = false, maxLength, label, icon: Icon }) => (
    <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor={id}>{label}</label>
        <div className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-transparent focus-within:border-blue-500 transition-colors">
            <Icon className="text-gray-400 mr-3" size={20} />
            <input
                className="flex-grow text-lg text-gray-800 bg-transparent focus:outline-none"
                id={id} name={name} type={type} placeholder={placeholder} value={value}
                onChange={onChange} required={required} maxLength={maxLength}
            />
        </div>
    </div>
);

export default function CompletarPerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', dni: '', telefonoPrincipal: '', telefonoSecundario: '',
    direccion: '', nombreContactoEmergencia: '', telefonoContactoEmergencia: ''
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.replace('/login');

    const checkProfile = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().profileCompleted) {
            toast.success('Tu perfil ya está completo.', { duration: 2000 });
            return router.replace('/');
        }

        const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
        setFormData(prev => ({ ...prev, nombre: firstName, apellido: lastNameParts.join(' ') }));
        setProfileLoading(false);
    };

    checkProfile();
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'dni' || name.includes('telefono')) && value && !/^[0-9]+$/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Tu sesión ha expirado.');

    startTransition(async () => {
      const result = await completarPerfil(user.uid, formData);
      if (result.success) {
        toast.success('¡Perfil completado! Redirigiendo...');
        setTimeout(() => router.push(result.role === 'admin' ? '/admin' : '/'), 1500);
      } else {
        toast.error(result.error || 'Hubo un error al guardar tu perfil.');
      }
    });
  };

  if (authLoading || profileLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="loader border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
        <Toaster position="bottom-center" />
        <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Completa tu Perfil</h1>
                <p className="text-lg text-gray-600 mt-2">¡Casi listo! Solo necesitamos unos datos más para crear tu cuenta.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <FormInput id="nombre" name="nombre" type="text" label="Nombre" icon={FaUser} value={formData.nombre} onChange={handleChange} required />
                        <FormInput id="apellido" name="apellido" type="text" label="Apellido" icon={FaUser} value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <FormInput id="dni" name="dni" type="tel" label="DNI" icon={FaIdCard} placeholder="Sin puntos" value={formData.dni} onChange={handleChange} required maxLength="8" />
                    <FormInput id="direccion" name="direccion" type="text" label="Dirección" icon={FaMapMarkerAlt} placeholder="Av. Siempreviva 742" value={formData.direccion} onChange={handleChange} required />
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <FormInput id="telefonoPrincipal" name="telefonoPrincipal" type="tel" label="Teléfono Principal" icon={FaPhone} placeholder="1122334455" value={formData.telefonoPrincipal} onChange={handleChange} required />
                        <FormInput id="telefonoSecundario" name="telefonoSecundario" type="tel" label="Teléfono Secundario" icon={FaPhone} placeholder="(Opcional)" value={formData.telefonoSecundario} onChange={handleChange} />
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Contacto de Emergencia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                         <FormInput id="nombreContactoEmergencia" name="nombreContactoEmergencia" type="text" label="Nombre" icon={FaExclamationTriangle} placeholder="Jane Doe" value={formData.nombreContactoEmergencia} onChange={handleChange} required />
                        <FormInput id="telefonoContactoEmergencia" name="telefonoContactoEmergencia" type="tel" label="Teléfono" icon={FaPhone} placeholder="1188776655" value={formData.telefonoContactoEmergencia} onChange={handleChange} required />
                    </div>
                </div>

                <div className="mt-8">
                    <button type="submit" disabled={isPending} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        {isPending ? 'Guardando...' : 'Guardar y Finalizar'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
