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
    reauthenticateWithCredential,
    signInWithCustomToken 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                const userDocRef = doc(db, 'users', userAuth.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUser({ ...userAuth, ...userData });
                } else {
                    // Para usuarios nuevos (ej. Google Sign-In), creamos un perfil inicial
                    const newUser = {
                        uid: userAuth.uid,
                        email: userAuth.email,
                        displayName: userAuth.displayName || 'Sin Nombre',
                        photoURL: userAuth.photoURL || null,
                        role: 'dueño', 
                        profileCompleted: false, // Perfil incompleto hasta que llenen el formulario
                        createdAt: new Date(),
                    };
                    await setDoc(userDocRef, newUser);
                    setUser({ ...userAuth, ...newUser });
                }
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // FIX: Nueva función para manejar el inicio de sesión con token personalizado
    const signInWithToken = async (token) => {
        try {
            const userCredential = await signInWithCustomToken(auth, token);
            // onAuthStateChanged se encargará de actualizar el estado del usuario automáticamente
            return userCredential.user;
        } catch (error) {
            console.error("Error en signInWithToken:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error en loginWithEmail:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error en loginWithGoogle:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error en signOut:", error);
            throw error;
        }
    };

    // Esta función ya no es la principal para el registro, pero se puede mantener por si se necesita.
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
        isLoggedIn,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword, // Se mantiene por completitud
        signOut,
        resetPassword,
        changePassword,
        logout: signOut,
        signInWithToken // Se expone la nueva función al resto de la app
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
