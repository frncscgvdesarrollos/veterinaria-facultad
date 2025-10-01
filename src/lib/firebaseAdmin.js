
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- INICIALIZACIÓN DEL SDK DE ADMIN ---

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado correctamente.');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin SDK:', error);
  }
} else {
  // console.log('Firebase Admin SDK ya estaba inicializado.');
}

// --- FUNCIÓN CENTRALIZADA DE VERIFICACIÓN DE SESIÓN ---

/**
 * Verifica la cookie de sesión del usuario en el lado del servidor.
 * @returns {Promise<string|null>} El UID del usuario si la sesión es válida, o null en caso contrario.
 */
export const getUserIdFromSession = async () => {
  try {
    // CORRECCIÓN CRÍTICA: La cookie se llama '__session', no 'session'.
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
      // Esto es esperado si el usuario no ha iniciado sesión.
      console.log('No se encontró la cookie de sesión.');
      return null;
    }

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    // console.log('Cookie de sesión verificada con éxito para UID:', decodedClaims.uid);
    return decodedClaims.uid;

  } catch (error) {
    // Esto es esperado si la cookie es inválida, ha expirado, o durante el build estático.
    console.log('No se pudo verificar la cookie de sesión:', error.message);
    return null;
  }
};

export default admin;
