'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPasswordResetCode, confirmPasswordReset, applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

const AuthActionPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [mode, setMode] = useState(null);
    const [actionCode, setActionCode] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ type: 'info', content: 'Verificando enlace...' });
    const [loading, setLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        const modeParam = searchParams.get('mode');
        const oobCodeParam = searchParams.get('oobCode');

        if (!modeParam || !oobCodeParam) {
            router.push('/login');
            return;
        }

        setMode(modeParam);
        setActionCode(oobCodeParam);

        switch (modeParam) {
            case 'resetPassword':
                handleResetPassword(oobCodeParam);
                break;
            case 'verifyEmail':
                handleVerifyEmail(oobCodeParam);
                break;
            default:
                setMessage({ type: 'error', content: 'Acción no reconocida.' });
                setLoading(false);
                break;
        }
    }, [searchParams, router]);

    const handleResetPassword = async (code) => {
        try {
            await verifyPasswordResetCode(auth, code);
            setMessage({ type: 'success', content: 'Enlace verificado. Por favor, introduce tu nueva contraseña.' });
            setFormVisible(true);
            setLoading(false);
        } catch (error) {
            console.error("Error verifying password reset code:", error);
            setMessage({ type: 'error', content: 'El enlace de restablecimiento es inválido o ha caducado. Por favor, solicita uno nuevo.' });
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (code) => {
        try {
            await applyActionCode(auth, code);
            setMessage({ type: 'success', content: '¡Tu correo ha sido verificado! Serás redirigido para iniciar sesión en 5 segundos.' });
            setLoading(false);
            setTimeout(() => router.push('/login'), 5000);
        } catch (error) {
            console.error("Error verifying email:", error);
            setMessage({ type: 'error', content: 'El enlace de verificación es inválido o ha caducado. Intenta iniciar sesión de nuevo para recibir otro.' });
            setLoading(false);
        }
    };
    
    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setMessage({ type: 'error', content: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', content: 'Restableciendo contraseña...' });
        
        try {
            await confirmPasswordReset(auth, actionCode, newPassword);
            setFormVisible(false);
            setMessage({ type: 'success', content: '¡Contraseña cambiada con éxito! Serás redirigido para iniciar sesión en 3 segundos.' });
            setTimeout(() => router.push('/login'), 3000);
        } catch (error) {
            console.error("Error confirming password reset:", error);
            setMessage({ type: 'error', content: 'No se pudo cambiar la contraseña. El enlace puede haber caducado. Por favor, solicita uno nuevo.' });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {mode === 'resetPassword' ? 'Restablecer Contraseña' : 'Verificando tu Correo'}
                    </h2>
                </div>
                
                {message.content && (
                    <div className={`p-4 rounded-md text-center ${
                        message.type === 'error' ? 'bg-red-100 text-red-700' :
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        <p>{message.content}</p>
                    </div>
                )}
                
                {formVisible && (
                    <form onSubmit={handleSubmitNewPassword} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthActionPage;
