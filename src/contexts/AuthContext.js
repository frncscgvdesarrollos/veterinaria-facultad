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
import { auth, db } from '@/lib/firebase'; // AsegÃºrate de exportar `db` desde tu config de firebase
import { doc, getDoc } from 'firebase/firestore'; // Importamos funciones de Firestore

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // AÃ±adimos un estado para saber si el usuario estÃ¡ logueado
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                // --- MEJORA: BUSCAMOS DATOS ADICIONALES EN FIRESTORE ---
                const userDocRef = doc(db, 'users', userAuth.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    // Si el documento existe, fusionamos los datos de auth y de la DB
                    const userData = userDocSnap.data();
                    setUser({ 
                        ...userAuth, 
                        ...userData // Esto aÃ±adirÃ¡ campos como `name`, `role`, etc.
                    });
                } else {
                    // Si no hay documento, usamos solo los datos de auth.
                    // PodrÃ­amos crear un documento aquÃ­ si fuera necesario al registrarse.
                    setUser(userAuth);
                }
                setIsLoggedIn(true);
            } else {
                // Si no hay usuario de Firebase Auth, reseteamos el estado
                setUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            // El useEffect se encargarÃ¡ de actualizar el estado del usuario
            return userCredential.user;
        } catch (error) {
            console.error("Error en loginWithEmail:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            return result.user;
        } catch (error) {
            console.error("Error en loginWithGoogle:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await fetch('/api/auth/session', { method: 'DELETE' });
            await firebaseSignOut(auth);
            // El useEffect se encargarÃ¡ de limpiar el estado
        } catch (error) {
            console.error("Error en signOut:", error);
            throw error;
        }
    };

    const registerWithEmailAndPassword = async (email, password) => {
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
        isLoggedIn, // Exponemos el booleano para mayor comodidad
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        signOut, // Cambiado el nombre a `signOut` para consistencia
        resetPassword,
        changePassword,
        logout: signOut // Exportamos `logout` como un alias de `signOut` para que el Header no se rompa
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
