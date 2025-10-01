// Historia de Usuario 5: Gestión de Roles de Usuario

import admin from 'firebase-admin';

// Comprobación para asegurar que el código se ejecuta solo en el servidor.
if (typeof window === 'undefined') {
  // Solo inicializar si no hay ya una app configurada
  if (!admin.apps.length) {
    try {
      // En un entorno de Google Cloud (como Firebase Studio o Vercel),
      // llamar a initializeApp() sin argumentos usará las Credenciales
      // Predeterminadas de la Aplicación (Application Default Credentials).
      // Esto es más seguro y no requiere gestionar claves manualmente.
      admin.initializeApp();
      console.log('Firebase Admin SDK inicializado correctamente con credenciales del entorno.');

    } catch (error) {
      console.error('ERROR AL INICIALIZAR FIREBASE ADMIN SDK:', error.message);
      console.error('Asegúrate de que el entorno de ejecución tiene acceso a las credenciales de Google Cloud.');
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
    if (error.code === 'auth/invalid-session-cookie' || error.code === 'app/no-app') {
         console.error("La cookie de sesión no es válida o el SDK de Admin no está configurado correctamente.")
    } else {
        console.error('Error al verificar la cookie de sesión:', error.code);
    }
    return null;
  }
}

export default admin;
