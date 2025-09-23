'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { completarPerfil } from '@/app/actions';
import PasswordStrengthMeter from '@/app/components/PasswordStrengthMeter'; // Importar el nuevo componente


const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);
const FormInput = memo(({ id, name, type, placeholder, value, onChange, required = false, pattern, maxLength, label, children }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>{label}</label>
        <div className="relative">
            <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                id={id} name={name} type={type} placeholder={placeholder} value={value}
                onChange={onChange} required={required} pattern={pattern} maxLength={maxLength}
            />
            {children}
        </div>
    </div>
));
FormInput.displayName = 'FormInput';


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
        direccion: '', /* barrio: '', */ nombreContactoEmergencia: '', telefonoContactoEmergencia: ''
    });

    const handleLoginWithGoogle = async () => {
        setError(null);
        try {
            await loginWithGoogle();
            router.push('/mascotas'); 
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
                    router.push('/mascotas');
                }
            } catch (error) {
                console.error('Fallo al registrar', error);
                setError(error.message || 'No se pudo crear la cuenta.');
            }
        } else {
            try {
                await loginWithEmail(email, password);
                router.push('/mascotas');
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
            alert('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
        } catch (error) {
            setError('No se pudo enviar el correo de restablecimiento.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'dni' || name.includes('telefono')) && value && !/^[0-9]+$/.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
                    
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                    
                    <div className="bg-white shadow-xl rounded-2xl px-8 pt-6 pb-8 mb-4">
                        <form onSubmit={handleFormSubmit}>
                            <FormInput id="email" name="email" type="email" label="Email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            
                            <FormInput id="password" name="password" type={showPassword ? 'text' : 'password'} label="Contraseña" placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </FormInput>

                            {isRegistering && (
                                <>
                                    <PasswordStrengthMeter password={password} />
                                    <FormInput id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} label="Confirmar Contraseña" placeholder="••••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                </> 
                            )}

                            {isRegistering && (
                                <>
                                    <hr className="my-6" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput id="nombre" name="nombre" type="text" label="Nombre" placeholder="Juan" value={formData.nombre} onChange={handleChange} required />
                                        <FormInput id="apellido" name="apellido" type="text" label="Apellido" placeholder="Pérez" value={formData.apellido} onChange={handleChange} required />
                                    </div>
                                    <FormInput id="dni" name="dni" type="tel" label="DNI" placeholder="Sin puntos" value={formData.dni} onChange={handleChange} required maxLength="8" />
                                    <FormInput id="direccion" name="direccion" type="text" label="Dirección" placeholder="Av. Siempreviva 742" value={formData.direccion} onChange={handleChange} required />
                                    {/* <FormInput id="barrio" name="barrio" type="text" label="Barrio" placeholder="Springfield" value={formData.barrio} onChange={handleChange} required /> */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput id="telefonoPrincipal" name="telefonoPrincipal" type="tel" label="Teléfono Principal" placeholder="1122334455" value={formData.telefonoPrincipal} onChange={handleChange} required />
                                        <FormInput id="telefonoSecundario" name="telefonoSecundario" type="tel" label="Teléfono Secundario" placeholder="(Opcional)" value={formData.telefonoSecundario} onChange={handleChange} />
                                    </div>
                                    <hr className="my-6" /><h3 className="text-lg font-semibold text-gray-700 mb-4">Contacto de Emergencia</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput id="nombreContactoEmergencia" name="nombreContactoEmergencia" type="text" label="Nombre" placeholder="Jane Doe" value={formData.nombreContactoEmergencia} onChange={handleChange} required />
                                        <FormInput id="telefonoContactoEmergencia" name="telefonoContactoEmergencia" type="tel" label="Teléfono" placeholder="1188776655" value={formData.telefonoContactoEmergencia} onChange={handleChange} required />
                                    </div>
                                </>
                            )}
                            
                            <div className="mt-6 flex items-center justify-between">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">
                                    {isRegistering ? 'Registrarme' : 'Entrar'}
                                </button>
                                {!isRegistering && <a className="font-bold text-sm text-blue-600 hover:text-blue-800 cursor-pointer" onClick={handlePasswordReset}>¿Olvidaste tu contraseña?</a>}
                            </div>
                        </form>
                        
                        <div className="text-center mt-6">
                            <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="font-bold text-sm text-gray-600 hover:text-gray-800">
                                {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-4">o</p>
                        <button onClick={handleLoginWithGoogle} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                            <Image src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google Logo" width={72} height={24} className="h-5 w-auto inline-block mr-2 align-middle"/>
                            Continuar con Google
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
