'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { registerWithEmail } from '@/lib/actions/user.actions.js';
import PasswordStrengthMeter from '@/app/components/PasswordStrengthMeter';

export default function LoginPage() {
    const { user, loginWithGoogle, loginWithEmail, signInWithToken, resetPassword } = useAuth();
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
                const newUserData = { email, password, ...formData };
                const result = await registerWithEmail(newUserData);

                if (result.success && result.token) {
                    await signInWithToken(result.token);
                } else {
                    setError(result.error);
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
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
            <Toaster position="bottom-center" />
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{
                    isRegistering ? 'Crear una Cuenta' : 'Iniciar Sesión'
                }</h1>

                <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center text-sm">{error}</p>}

                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-gray-600">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                                className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                        </div>

                        <div>
                            <div className="flex justify-between items-baseline">
                                <label className="text-xs font-semibold text-gray-600">Contraseña</label>
                                {!isRegistering && (
                                    <button type="button" onClick={handlePasswordReset} className="text-xs text-blue-500 hover:underline font-semibold">
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                )}
                            </div>
                            <div className="relative mt-1">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        
                        {isRegistering && (
                            <>
                                <PasswordStrengthMeter password={password} />
                                <div>
                                    <label className="text-xs font-semibold text-gray-600">Confirmar Contraseña</label>
                                    <div className="relative mt-1">
                                        <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                                    </div>
                                </div>
                                
                                <hr className="my-4"/>

                                <h2 className="text-center text-base font-semibold text-gray-700">Tu Información</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                    <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                </div>
                                <input name="dni" placeholder="DNI" value={formData.dni} onChange={handleInputChange} required maxLength="8" className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                <input name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                <input name="telefonoPrincipal" placeholder="Teléfono" value={formData.telefonoPrincipal} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                
                                <h2 className="text-center text-base font-semibold text-gray-700">Contacto de Emergencia</h2>
                                <input name="nombreContactoEmergencia" placeholder="Nombre" value={formData.nombreContactoEmergencia} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                                <input name="telefonoContactoEmergencia" placeholder="Teléfono" value={formData.telefonoContactoEmergencia} onChange={handleInputChange} required className="w-full p-3 bg-gray-50 border-gray-200 rounded-lg"/>
                            </>
                        )}

                        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                            {isRegistering ? 'Registrarse' : 'Entrar'}
                        </button>
                    </form>
                    
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">¿{isRegistering ? 'Ya tienes' : 'No tienes'} una cuenta? 
                            <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="font-semibold text-blue-500 hover:underline ml-1">
                                {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="text-center my-6 text-gray-400 text-xs tracking-wider">o</div>

                <button onClick={handleLoginWithGoogle} 
                    className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-md">
                    <span className="text-sm font-semibold text-gray-700 mr-2">Continuar con</span>
                    <span className="text-sm font-bold">
                        <span style={{ color: '#4285F4' }}>G</span>
                        <span style={{ color: '#EA4335' }}>o</span>
                        <span style={{ color: '#FBBC05' }}>o</span>
                        <span style={{ color: '#4285F4' }}>g</span>
                        <span style={{ color: '#34A853' }}>l</span>
                        <span style={{ color: '#EA4335' }}>e</span>
                    </span>
                </button>
            </div>
        </div>
    );
}
