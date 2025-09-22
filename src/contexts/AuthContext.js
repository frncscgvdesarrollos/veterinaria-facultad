// Historia de Usuario 1: Registro de Nuevo Usuario
// Historia de Usuario 2: Inicio de Sesión de Usuario
// Historia de Usuario 3: Inicio de Sesión con Google
// Historia de Usuario 4: Recuperación de Contraseña
// Historia de Usuario 5: Gestión de Roles de Usuario
// Historia de Usuario 6: Completar Perfil de Usuario

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

    /**
     * @function loginWithGoogle
     * @description Inicia sesión o registra a un usuario utilizando su cuenta de Google.
     * Corresponde a la "Historia de Usuario 3: Inicio de Sesión con Google".
     */
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con Google:", error);
        }
    };

    /**
     * @function loginWithEmail
     * @description Autentica a un usuario registrado mediante su correo electrónico y contraseña.
     * Corresponde a la "Historia de Usuario 2: Inicio de Sesión de Usuario".
     */
    const loginWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con email y contraseña:", error);
            throw error;
        }
    };

    /**
     * @function registerWithEmailAndPassword
     * @description Registra un nuevo usuario con correo y contraseña.
     * Tras el registro, invoca la función para completar el perfil inicial.
     * Corresponde a la "Historia de Usuario 1: Registro de Nuevo Usuario" y
     * a la "Historia de Usuario 6: Completar Perfil de Usuario".
     */
    const registerWithEmailAndPassword = async (email, password, profileData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            if (user) {
                // Se llama a la server action para guardar los datos adicionales del perfil.
                await completarPerfil(user.uid, profileData);
            }
            return result;
        } catch (error) {
            console.error("Error durante el registro:", error);
            throw error;
        }
    };

    /**
     * @function resetPassword
     * @description Envía un correo electrónico al usuario para que pueda restablecer su contraseña.
     * Corresponde a la "Historia de Usuario 4: Recuperación de Contraseña".
     */
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

    /**
     * useEffect para observar cambios en el estado de autenticación.
     * Cuando un usuario inicia o cierra sesión, este efecto se ejecuta.
     * Obtiene el token de ID del usuario y extrae el "custom claim" del rol.
     * Si no tiene un rol asignado, se le da el rol de 'dueño' por defecto.
     * Corresponde a la "Historia de Usuario 5: Gestión de Roles de Usuario".
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken();
                    // Se envía el token al backend para crear una cookie de sesión.
                    await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                    });

                    // Se fuerza la actualización del token para obtener los claims más recientes.
                    const idTokenResult = await currentUser.getIdTokenResult(true);
                    // Se lee el rol desde los custom claims del token.
                    const roleFromClaim = idTokenResult.claims.role;
                    
                    setUser(currentUser);
                    // Se establece el rol del usuario en el contexto. Por defecto es 'dueño'.
                    setUserRole(roleFromClaim || 'dueño');

                } catch (error) {
                    console.error("Error al gestionar la sesión del usuario:", error);
                    // En caso de error, se mantiene al usuario pero con el rol base.
                    setUser(currentUser);
                    setUserRole('dueño');
                }
            } else {
                // Si no hay usuario, se limpia el estado.
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
