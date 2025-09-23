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
import { auth, db } from '@/lib/firebase'; // Asegúrate de exportar `db` desde tu config de firebase
import { doc, getDoc } from 'firebase/firestore'; // Importamos funciones de Firestore

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
                    setUser({ 
                        ...userAuth, 
                        ...userData
                    });
                } else {
                    setUser(userAuth);
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

    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
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
        isLoggedIn,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        signOut,
        resetPassword,
        changePassword,
        logout: signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
