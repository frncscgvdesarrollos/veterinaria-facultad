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
                    const userDocRef = doc(db, 'users', userAuth.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUser({ ...userAuth, ...userData });
                    } else {
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
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

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
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        return updatePassword(user, newPassword);
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
