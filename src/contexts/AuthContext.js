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
    signInWithCustomToken,
    verifyPasswordResetCode,
    confirmPasswordReset,
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
            try {
                if (userAuth) {
                    // 1. Create server-side session cookie
                    const idToken = await userAuth.getIdToken();
                    await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                    });
                    
                    // 2. Get user data from Firestore
                    const userDocRef = doc(db, 'users', userAuth.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUser({ ...userAuth, ...userData });
                    } else {
                        // This case is mainly for Google Sign-in where the user might not be in our DB yet
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
                    // User is signed out, clear server-side session cookie
                    await fetch('/api/auth/session', { method: 'DELETE' });
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error en onAuthStateChanged:", error);
                // Also clear session on error
                await fetch('/api/auth/session', { method: 'DELETE' });
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // These functions now just trigger the Firebase SDK methods.
    // The onAuthStateChanged listener above handles all the session and state logic.

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const signOut = () => firebaseSignOut(auth);

    const signInWithToken = (token) => signInWithCustomToken(auth, token);
    
    const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
    
    const registerWithEmailAndPassword = (email, password) => createUserWithEmailAndPassword(auth, email, password);

    const resetPassword = (email) => sendPasswordResetEmail(auth, email);

    const changePassword = async (currentPassword, newPassword) => {
        const userCredential = auth.currentUser;
        if (!userCredential) throw new Error("No hay usuario autenticado.");
        const credential = EmailAuthProvider.credential(userCredential.email, currentPassword);
        await reauthenticateWithCredential(userCredential, credential);
        return updatePassword(userCredential, newPassword);
    };

    const verifyResetCode = (code) => {
        return verifyPasswordResetCode(auth, code);
    };

    const handlePasswordReset = (code, newPassword) => {
        return confirmPasswordReset(auth, code, newPassword);
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
        verifyResetCode, 
        handlePasswordReset,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
