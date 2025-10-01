
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// Función para inicializar Firebase Admin SDK de forma segura
const initializeFirebaseAdmin = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado correctamente desde variable de entorno.');
  } else {
    console.error(
      'Error Crítico: La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida. La autenticación de servidor no funcionará.'
    );
  }
};

// Evita reinicializaciones en entornos de desarrollo con hot-reloading.
if (!admin.apps.length) {
  initializeFirebaseAdmin();
}

/**
 * Verifica la cookie de sesión de Firebase del usuario.
 * @returns {Promise<string|null>} El UID del usuario si la sesión es válida, de lo contrario null.
 */
export const getUserIdFromSession = async () => {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    // La cookie es inválida o ha expirado.
    console.log('No se pudo verificar la cookie de sesión:', error.message);
    return null;
  }
};

export default admin;
