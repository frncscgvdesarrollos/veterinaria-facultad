'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// SE ELIMINA LA IMPORTACIÓN DE LA SERVER ACTION
// import { completarPerfil } from '@/app/actions';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // El nombre correcto de la propiedad es 'user', no 'currentUser'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error durante el inicio de sesión con Google:", error);
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error durante el inicio de sesión con email y contraseña:", error);
            throw error;
        }
    };

    /**
     * Esta función AHORA solo se encarga de crear el usuario en Firebase Auth.
     * Ya no necesita los datos del perfil.
     */
    const registerWithEmailAndPassword = async (email, password) => {
        try {
            // Solo crea el usuario y devuelve el resultado.
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            console.error("Error durante el registro:", error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
            throw error;
        }
    };


    const changePassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error("No hay un usuario autenticado para realizar esta operación.");
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/auth/session', { method: 'DELETE' });
            // Redirigir a la raíz para un estado limpio.
            window.location.href = '/';
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
                setUser(currentUser);
            } else {
                await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user, // La propiedad se llama 'user'
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        resetPassword,
        changePassword,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
