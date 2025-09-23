import { cookies } from 'next/headers';
import admin from './firebaseAdmin';

/**
 * @name getCurrentUser
 * @description Obtiene el usuario actual desde la cookie de sesión en el servidor.
 * Esta función solo debe ser usada en Componentes de Servidor o Rutas de API.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken | null>} El token decodificado del usuario o null si no hay sesión.
 */
export async function getCurrentUser() {

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('__session')?.value || '';

  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}
