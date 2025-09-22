// Historia de Usuario 6: Completar Perfil de Usuario

'use client';

import { useState, useTransition, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { completarPerfil } from '@/app/actions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


const FormInput = ({ id, name, type, placeholder, value, onChange, required = false, pattern, maxLength, label, children, disabled = false }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>{label}</label>
        <div className="relative">
            <input
                className={`shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                id={id} name={name} type={type} placeholder={placeholder} value={value}
                onChange={onChange} required={required} pattern={pattern} maxLength={maxLength} disabled={disabled}
            />
            {children}
        </div>
    </div>
);

export default function CompletarPerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefonoPrincipal: '',
    telefonoSecundario: '',
    direccion: '',
    barrio: '',
    nombreContactoEmergencia: '',
    telefonoContactoEmergencia: '',
  });

  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      router.replace('/login');
      return;
    }

    const checkProfile = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().profileCompleted) {
            toast.success('Tu perfil ya está completo.', { duration: 2000 });
            router.replace('/');
        } else {
            const existingData = userDocSnap.data() || {};
            const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
            setFormData(prev => ({
                ...prev,
                nombre: existingData.nombre || firstName,
                apellido: existingData.apellido || lastNameParts.join(' '),
                ...existingData
            }));
            setProfileLoading(false);
        }
    };

    checkProfile();

  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'dni' || name.includes('telefono')) && value && !/^[0-9]+$/.test(value)) {
      return; // Solo números para DNI y teléfonos
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      return router.push('/login');
    }

    startTransition(async () => {
      const result = await completarPerfil(user.uid, formData);

      if (result.success) {
        toast.success('¡Perfil completado con éxito! Redirigiendo...');
        setTimeout(() => {
            router.push(result.role === 'admin' ? '/admin' : '/');
        }, 1500);
      } else {
        toast.error(result.error || 'Hubo un error al guardar tu perfil.');
      }
    });
  };

  if (authLoading || profileLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="loader"></div> {/* Un spinner de carga más visual */}
            <style jsx>{`
                .loader {
                    border: 4px solid #f3f3f3; /* Light grey */
                    border-top: 4px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Toaster position="bottom-center" />
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Completa tu Perfil</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                ¡Casi listo! Solo necesitamos un par de datos más para continuar.
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="nombre" name="nombre" type="text" label="Nombre" placeholder="Juan" value={formData.nombre} onChange={handleChange} required />
                    <FormInput id="apellido" name="apellido" type="text" label="Apellido" placeholder="Pérez" value={formData.apellido} onChange={handleChange} required />
                </div>
                <FormInput id="dni" name="dni" type="tel" label="DNI" placeholder="Sin puntos ni espacios" value={formData.dni} onChange={handleChange} required maxLength="8" />
                <FormInput id="direccion" name="direccion" type="text" label="Dirección" placeholder="Av. Siempreviva 742" value={formData.direccion} onChange={handleChange} required />
                <FormInput id="barrio" name="barrio" type="text" label="Barrio" placeholder="Springfield" value={formData.barrio} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="telefonoPrincipal" name="telefonoPrincipal" type="tel" label="Teléfono Principal" placeholder="1122334455" value={formData.telefonoPrincipal} onChange={handleChange} required />
                    <FormInput id="telefonoSecundario" name="telefonoSecundario" type="tel" label="Teléfono Secundario" placeholder="(Opcional)" value={formData.telefonoSecundario} onChange={handleChange} />
                </div>
                
                <hr className="my-6" />
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Contacto de Emergencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="nombreContactoEmergencia" name="nombreContactoEmergencia" type="text" label="Nombre" placeholder="Jane Doe" value={formData.nombreContactoEmergencia} onChange={handleChange} required />
                    <FormInput id="telefonoContactoEmergencia" name="telefonoContactoEmergencia" type="tel" label="Teléfono" placeholder="1188776655" value={formData.telefonoContactoEmergencia} onChange={handleChange} required />
                </div>

                    <div>
                        <button type="submit" disabled={isPending} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isPending ? 'Guardando...' : 'Guardar y Finalizar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}
