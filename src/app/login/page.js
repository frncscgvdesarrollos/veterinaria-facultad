'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, registerWithEmail } from '@/app/actions';
import PasswordStrengthMeter from '@/app/components/PasswordStrengthMeter';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);

    // Estado del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [telefonoPrincipal, setTelefonoPrincipal] = useState('');
    const [telefonoSecundario, setTelefonoSecundario] = useState('');
    const [direccion, setDireccion] = useState('');
    const [nombreContactoEmergencia, setNombreContactoEmergencia] = useState('');
    const [telefonoContactoEmergencia, setTelefonoContactoEmergencia] = useState('');

    // Estado de la UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, text: '' });

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/mascotas');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Aquí llamarías a una Server Action para iniciar sesión con email/password
        // const result = await signInWithEmail(email, password);
        // if (result.error) { ... }
        console.log("Login con", { email, password });
        // Simulación, reemplaza con tu lógica real
        setTimeout(() => {
            setLoading(false);
            setError("La funcionalidad de inicio de sesión con email aún no está implementada.");
        }, 1000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (passwordStrength.percentage < 75) {
            setError('La contraseña no es lo suficientemente segura.');
            return;
        }

        setLoading(true);
        setError('');

        const userData = {
            email, password, nombre, apellido, dni,
            telefonoPrincipal, telefonoSecundario, direccion,
            nombreContactoEmergencia, telefonoContactoEmergencia
        };

        const result = await registerWithEmail(userData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/mascotas');
        }
        setLoading(false);
    };
    
    const isRegisterButtonDisabled = isRegistering && (passwordStrength.percentage < 75 || password !== confirmPassword || !email || !nombre || !apellido || !dni);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">{isRegistering ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                        <button onClick={() => setIsRegistering(!isRegistering)} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
                        </button>
                    </p>
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-200">
                    <Image src="/google.svg" alt="Google logo" width={20} height={20} className="mr-2" />
                    Continuar con Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O continúa con tu email</span>
                    </div>
                </div>

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                     {isRegistering && (
                        <>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nombre" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                <input type="text" placeholder="Apellido" required value={apellido} onChange={e => setApellido(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <input type="text" placeholder="DNI" required value={dni} onChange={e => setDni(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                       </>
                    )}
                    <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                     <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Contraseña" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600">
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                    
                    {isRegistering && (
                        <>
                            <PasswordStrengthMeter password={password} onStrengthChange={setPasswordStrength} />
                            <input type="password" placeholder="Confirmar Contraseña" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            {password && confirmPassword && password !== confirmPassword && <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden.</p>}
                            
                            <h3 class="text-lg font-semibold text-gray-800 pt-4 border-t mt-6">Datos Adicionales (Opcional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input type="text" placeholder="Teléfono Principal" value={telefonoPrincipal} onChange={e => setTelefonoPrincipal(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                               <input type="text" placeholder="Teléfono Secundario" value={telefonoSecundario} onChange={e => setTelefonoSecundario(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder="Contacto de Emergencia" value={nombreContactoEmergencia} onChange={e => setNombreContactoEmergencia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                              <input type="text" placeholder="Teléfono de Emergencia" value={telefonoContactoEmergencia} onChange={e => setTelefonoContactoEmergencia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </>
                    )}

                    {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={loading || isRegisterButtonDisabled} className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                            {loading ? 'Cargando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                        </button>
                         {isRegisterButtonDisabled && <p className="text-center text-xs text-gray-500 mt-2">Completa los campos requeridos y asegúrate de que la contraseña sea al menos 'Fuerte'.</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}
