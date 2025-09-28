'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaEye, FaEyeSlash, FaUser, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { completarPerfil } from '@/app/actions';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

export default function LoginPage() {
    const { user, loginWithGoogle, loginWithEmail, registerWithEmailAndPassword, resetPassword } = useAuth();
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '', apellido: '', dni: '', telefonoPrincipal: '', telefonoSecundario: '', 
        direccion: '', nombreContactoEmergencia: '', telefonoContactoEmergencia: ''
    });

    useEffect(() => {
        if (user) {
            if (user.profileCompleted) {
                router.push(user.role === 'admin' ? '/admin' : '/');
            } else {
                router.push('/completar-perfil');
            }
        }
    }, [user, router]);

    const handleLoginWithGoogle = async () => {
        setError(null);
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Fallo al iniciar sesión con Google', error);
            setError('Fallo al iniciar sesión con Google. Por favor, intenta de nuevo.');
        }
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isRegistering) {
            if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");
            if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
            
            try {
                const result = await registerWithEmailAndPassword(email, password);
                if (result.user) {
                    const profileResult = await completarPerfil(result.user.uid, formData);
                    if (!profileResult.success) throw new Error(profileResult.error);
    
                    const idToken = await result.user.getIdToken();
                    await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    });
                    // Redirección directa a la página principal/admin después de completar el perfil
                    router.push(profileResult.role === 'admin' ? '/admin' : '/');
                }
            } catch (error) {
                console.error('Fallo al registrar', error);
                setError(error.message || 'No se pudo crear la cuenta.');
            }
        } else {
            try {
                await loginWithEmail(email, password);
            } catch (error) {
                console.error('Fallo al iniciar sesión', error);
                setError('Email o contraseña incorrectos.');
            }
        }
    };

    const handlePasswordReset = async () => {
        if (!email) return setError("Ingresa tu email para restablecer la contraseña.");
        setError(null);
        try {
            await resetPassword(email);
            toast.success('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
        } catch (error) {
            setError('No se pudo enviar el correo de restablecimiento.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'dni' || name.includes('telefono')) && value && !/^[0-9]+$/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
             <Toaster position="bottom-center" />
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{
                    isRegistering ? 'Crea tu Cuenta' : 'Bienvenido de Vuelta'
                }</h1>
                <p className="text-center text-gray-500 mb-8">{
                    isRegistering ? 'Completa tus datos para empezar.' : 'Inicia sesión para continuar.'
                }</p>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}

                <form onSubmit={handleFormSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-transparent focus-within:border-blue-500">
                            <FaUser className="text-gray-400 mr-3"/>
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-grow bg-transparent focus:outline-none"/>
                        </div>
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-transparent focus-within:border-blue-500">
                            <FaLock className="text-gray-400 mr-3"/>
                            <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="flex-grow bg-transparent focus:outline-none"/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {isRegistering && (
                            <>
                                <PasswordStrengthMeter password={password} />
                                <div className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-transparent focus-within:border-blue-500">
                                    <FaLock className="text-gray-400 mr-3"/>
                                    <input type={showPassword ? "text" : "password"} placeholder="Confirmar Contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="flex-grow bg-transparent focus:outline-none"/>
                                </div>
                                
                                <h2 className="text-xl font-semibold text-gray-700 pt-4 border-t mt-6">Tu Información</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                                    <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                                </div>
                                <input name="dni" placeholder="DNI (sin puntos)" value={formData.dni} onChange={handleInputChange} required maxLength="8" className="w-full p-3 bg-gray-50 rounded-lg"/>
                                <input name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                                <input name="telefonoPrincipal" placeholder="Teléfono Principal" value={formData.telefonoPrincipal} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                                <h2 className="text-xl font-semibold text-gray-700 pt-4 border-t mt-6">Contacto de Emergencia</h2>
                                <input name="nombreContactoEmergencia" placeholder="Nombre" value={formData.nombreContactoEmergencia} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                                <input name="telefonoContactoEmergencia" placeholder="Teléfono" value={formData.telefonoContactoEmergencia} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 rounded-lg"/>
                            </>
                        )}
                    </div>
                    <button type="submit" className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                    </button>
                </form>

                {!isRegistering && (
                    <div className="text-center mt-4">
                        <button onClick={handlePasswordReset} className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</button>
                    </div>
                )}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O continúa con</span>
                    </div>
                </div>

                <button onClick={handleLoginWithGoogle} className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaGoogle className="mr-2 text-red-500"/> Google
                </button>

                <div className="text-center mt-8">
                    <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="text-sm text-blue-500 hover:underline">
                        {isRegistering ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}