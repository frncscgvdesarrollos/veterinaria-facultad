'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect ahora solo se encarga de sincronizar el estado del usuario con React.
    // Ya no maneja la creación/eliminación de cookies.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- FUNCIONES DE LOGIN --- //
    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // Creamos la cookie de sesión ANTES de que la función termine.
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo crear la sesión en el servidor.');
            }

            return userCredential.user;

        } catch (error) {
            console.error("Error en loginWithEmail:", error);
            throw error; // Relanzamos el error para que el componente de login lo maneje
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
            });

            if (!response.ok) {
                throw new Error('No se pudo crear la sesión con Google en el servidor.');
            }
            // La redirección y el manejo del usuario se harán en la página de login
            return result.user;
        } catch (error) {
            console.error("Error en loginWithGoogle:", error);
            throw error;
        }
    };

    // --- FUNCIÓN DE LOGOUT --- //
    const signOut = async () => {
        try {
            // Primero, eliminamos la cookie de sesión del servidor.
            await fetch('/api/auth/session', { method: 'DELETE' });
            // Luego, cerramos la sesión de Firebase.
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error en signOut:", error);
            throw error;
        }
    };
    
    // --- OTRAS FUNCIONES (sin cambios mayores) --- //
    const registerWithEmailAndPassword = async (email, password) => {
        // La creación de la sesión post-registro se manejará por separado
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const changePassword = async (currentPassword, newPassword) => {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        return updatePassword(user, newPassword);
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        signOut,
        resetPassword,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children} 
        </AuthContext.Provider>
    );
};
