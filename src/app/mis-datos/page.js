
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Componente reutilizable para los campos del formulario
const FormInput = ({ id, name, type, placeholder, value, onChange, required = true, label }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>{label}</label>
        <input
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id={id} name={name} type={type} placeholder={placeholder} value={value}
            onChange={onChange} required={required}
        />
    </div>
);

export default function MisDatosPage() {
    const { user, loading, changePassword } = useAuth(); // Importamos changePassword
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // Estado para el formulario de cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchProfileData = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setProfileData(userDocSnap.data());
            }
            setProfileLoading(false);
        };

        fetchProfileData();
    }, [user, loading, router]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (newPassword !== confirmPassword) {
            toast.error('La nueva contraseña y su confirmación no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        const toastId = toast.loading('Cambiando contraseña...');

        try {
            await changePassword(currentPassword, newPassword);
            toast.success('¡Contraseña actualizada con éxito!', { id: toastId });
            // Limpiar los campos por seguridad
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/wrong-password') {
                toast.error('La contraseña actual es incorrecta.', { id: toastId });
            } else {
                toast.error('Hubo un error al cambiar la contraseña.', { id: toastId });
            }
        }
    };

    if (loading || profileLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                 <div className="loader"></div>
                 <style jsx>{`
                    .loader {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3498db;
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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <Toaster position="bottom-center" />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Mis Datos</h1>
                    
                    {profileData ? (
                        <div className="space-y-4 text-gray-700 mb-10">
                           <p><strong>Nombre:</strong> {profileData.nombre} {profileData.apellido}</p>
                           <p><strong>DNI:</strong> {profileData.dni}</p>
                           <p><strong>Email:</strong> {user.email}</p>
                           <p><strong>Dirección:</strong> {profileData.direccion}, {profileData.barrio}</p>
                           <p><strong>Teléfono:</strong> {profileData.telefonoPrincipal}</p>
                        </div>
                    ) : (
                        <p className="text-gray-600 mb-10">No se encontraron datos de perfil adicionales.</p>
                    )}
                    
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
                        <form onSubmit={handlePasswordSubmit} className="max-w-md">
                            <FormInput id="currentPassword" name="currentPassword" type="password" label="Contraseña Actual" placeholder="••••••••••" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                            <FormInput id="newPassword" name="newPassword" type="password" label="Nueva Contraseña" placeholder="Mínimo 6 caracteres" value={passwordData.newPassword} onChange={handlePasswordChange} />
                            <FormInput id="confirmPassword" name="confirmPassword" type="password" label="Confirmar Nueva Contraseña" placeholder="Repite la nueva contraseña" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                            <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105">
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
