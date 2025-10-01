
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- INICIALIZACIÓN DEL SDK DE ADMIN ---

// 1. Decodificar la clave de servicio desde Base64.
// Esto evita problemas de formato con los saltos de línea en las variables de entorno.
const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
let serviceAccount;

if (serviceAccountB64) {
  try {
    const serviceAccountJson = Buffer.from(serviceAccountB64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Error al decodificar o parsear la clave de servicio de Firebase desde Base64:', error);
  }
} else {
  console.error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_BASE64 no está definida.');
}

// 2. Inicializar la app de Firebase Admin
if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK inicializado correctamente.');
    } catch (error) {
      console.error('Error al inicializar Firebase Admin SDK:', error);
    }
  } else {
    console.error('No se pudo inicializar Firebase Admin SDK porque la clave de servicio no es válida.');
  }
}

// --- FUNCIÓN CENTRALIZADA DE VERIFICACIÓN DE SESIÓN ---

/**
 * Verifica la cookie de sesión del usuario en el lado del servidor.
 * @returns {Promise<string|null>} El UID del usuario si la sesión es válida, o null en caso contrario.
 */
export const getUserIdFromSession = async () => {
  try {
    const sessionCookie = cookies().get('__session')?.value;

    if (!sessionCookie) {
      // console.log('No se encontró la cookie de sesión.');
      return null;
    }

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;

  } catch (error) {
    // console.log('No se pudo verificar la cookie de sesión:', error.message);
    return null;
  }
};

export default admin;
