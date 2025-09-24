// Historia de Usuario 5: Gestión de Roles de Usuario

import admin from 'firebase-admin';

if (typeof window === 'undefined') {
  if (!admin.apps.length) {
    try {
       const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      console.log('Firebase Admin SDK inicializado correctamente.');

    } catch (error) {
      console.error('ERROR AL INICIALIZAR FIREBASE ADMIN SDK:', error);
      console.error('Asegúrate de haber configurado la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY en Vercel con el JSON de tu cuenta de servicio.');
    }
  }
}

/**
 * Verifica la cookie de sesión de Firebase y devuelve el UID del usuario.
 * @param {string} sessionCookie 
 * @returns {Promise<string|null>}
 */
export async function getUserIdFromSession(sessionCookie) {
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, false);
    return decodedClaims.uid;
  } catch (error) {
    // Si el SDK no se inicializó, este error puede ocurrir.
    if (error.code === 'auth/invalid-session-cookie') {
         console.error("La cookie de sesión no es válida. Puede que haya expirado o el SDK de Admin no esté configurado correctamente.")
    } else {
        console.error('Error al verificar la cookie de sesión:', error.code);
    }
    return null;
  }
}


export default admin;
