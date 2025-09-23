// Historia de Usuario 5: Gestión de Roles de Usuario

import admin from 'firebase-admin';


if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Error en la inicialización de Firebase Admin SDK:', error);
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
    // CAMBIO DE DIAGNÓSTICO: Se cambia a 'false' para desactivar la comprobación de revocación.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, false);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error al verificar la cookie de sesión:', error.code);
    return null;
  }
}


export default admin;
