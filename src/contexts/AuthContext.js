
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
import { completarPerfil } from '@/app/actions';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con Google:", error);
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con email y contraseña:", error);
            throw error;
        }
    };

    const registerWithEmailAndPassword = async (email, password, profileData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            if (user) {
                await completarPerfil(user.uid, profileData);
            }
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

    // --- NUEVA FUNCIÓN PARA CAMBIAR LA CONTRASEÑA ---
    const changePassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error("No hay un usuario autenticado para realizar esta operación.");
        }

        // 1. Crear la credencial con el email del usuario y su contraseña actual
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            // 2. Re-autenticar al usuario. Esto verifica que conoce su contraseña actual.
            await reauthenticateWithCredential(user, credential);

            // 3. Si la re-autenticación fue exitosa, actualizar la contraseña.
            await updatePassword(user, newPassword);

        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            // Lanzar el error para poder gestionarlo en el componente (ej. contraseña incorrecta)
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/auth/session', { method: 'DELETE' });
            router.push('/login');
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken();
                    await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                    });

                    const idTokenResult = await currentUser.getIdTokenResult(true);
                    const roleFromClaim = idTokenResult.claims.role;
                    
                    setUser(currentUser);
                    setUserRole(roleFromClaim || 'dueño');

                } catch (error) {
                    console.error("Error al gestionar la sesión del usuario:", error);
                    setUser(currentUser);
                    setUserRole('dueño');
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userRole, 
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        resetPassword,
        changePassword, // <-- Exportar la nueva función
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
