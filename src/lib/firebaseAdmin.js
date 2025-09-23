// Historia de Usuario 5: Gestión de Roles de Usuario

import admin from 'firebase-admin';

// Comprobación para asegurar que el código se ejecuta solo en el servidor.
if (typeof window === 'undefined') {
  if (!admin.apps.length) {
    try {
      // Para que el Admin SDK funcione en Vercel, necesita las credenciales de la cuenta de servicio.
      // Estas deben ser almacenadas como una variable de entorno en el proyecto de Vercel.
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      console.log('Firebase Admin SDK inicializado correctamente.');

    } catch (error) {
      // Este error es común si la variable de entorno no está configurada en Vercel.
      console.error('ERROR AL INICIALIZAR FIREBASE ADMIN SDK:', error);
      console.error('Asegúrate de haber configurado la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY en Vercel con el JSON de tu cuenta de servicio.');
    }
  }
}

/**
 * Verifica la cookie de sesión de Firebase y devuelve el UID del usuario.
 * @param {string} sessionCookie La cadena de la cookie de sesión.
 * @returns {Promise<string|null>} El UID del usuario o null si la cookie no es válida.
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
