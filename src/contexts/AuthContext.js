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
// Importamos las instancias ya inicializadas de forma segura
import { auth, db } from '@/lib/firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // onAuthStateChanged ya se asegura de ejecutarse solo cuando auth está listo.
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            try {
                if (userAuth) {
                    const userDocRef = doc(db, 'users', userAuth.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUser({ ...userAuth, ...userData });
                    } else {
                        // Para usuarios nuevos, creamos un perfil básico.
                        const newUser = {
                            uid: userAuth.uid,
                            email: userAuth.email,
                            displayName: userAuth.displayName || 'Sin Nombre',
                            photoURL: userAuth.photoURL || null,
                            role: 'dueño',
                            profileCompleted: false,
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
            } catch (error) {
                console.error("Error durante la verificación de estado de autenticación:", error);
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                // Nos aseguramos de que la carga termine, pase lo que pase.
                setLoading(false);
            }
        });

        // Limpiamos el listener al desmontar el componente
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            // Con la inicialización corregida, esto ya no debería fallar.
            return await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Fallo al iniciar sesión con Google", error);
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
    
    const signInWithToken = async (token) => {
        try {
            const userCredential = await signInWithCustomToken(auth, token);
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

    const registerWithEmailAndPassword = (email, password) => {
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
        signOut,
        logout: signOut,
        signInWithToken,
        loginWithEmail,
        registerWithEmailAndPassword,
        resetPassword,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
