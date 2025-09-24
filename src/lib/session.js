import { cookies } from 'next/headers';
import admin from './firebaseAdmin';

/**
 * @name getCurrentUser
 * @description Obtiene el usuario actual desde la cookie de sesión en el servidor.
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken | null>} 
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
