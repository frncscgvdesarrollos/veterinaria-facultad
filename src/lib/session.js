import { cookies } from 'next/headers';
import admin from './firebaseAdmin';

/**
 * @name getCurrentUser
 * @description Obtiene el usuario actual desde la cookie de sesión en el servidor.
 * Esta función solo debe ser usada en Componentes de Servidor o Rutas de API.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken | null>} El token decodificado del usuario o null si no hay sesión.
 */
export async function getCurrentUser() {
  // CORREGIDO: Se usa await y se busca la cookie '__session'
  const sessionCookie = (await cookies().get('__session'))?.value || '';

  // Si no hay cookie, no hay usuario.
  if (!sessionCookie) {
    return null;
  }

  try {
    // Se verifica la cookie de sesión con Firebase Admin.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // La cookie no es válida (expiró, fue revocada, etc.)
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
