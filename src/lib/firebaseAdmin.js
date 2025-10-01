
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- DIAGNÓSTICO DE INICIALIZACIÓN DE FIREBASE ADMIN ---
console.log('--- Firebase Admin Initialization --- ');
console.log('Verificando variables de entorno durante el build...');
console.log('FIREBASE_PROJECT_ID existe:', !!process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY existe:', !!process.env.FIREBASE_PRIVATE_KEY);

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
  console.log('No hay apps de Firebase. Intentando inicializar...');
  if (serviceAccount.project_id && serviceAccount.private_key) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('ÉXITO: Firebase Admin SDK inicializado correctamente.');
    } catch (error) {
      console.error('ERROR: Fallo durante admin.initializeApp:', error.message);
    }
  } else {
    console.error('ERROR: No se inicializó. Faltan FIREBASE_PROJECT_ID o FIREBASE_PRIVATE_KEY.');
  }
} else {
  console.log('Firebase Admin SDK ya estaba inicializado.');
}

console.log('--- Fin de la inicialización de Firebase Admin ---');

export const getUserIdFromSession = async () => {
  if (!admin.apps.length) {
    console.log('getUserIdFromSession: App no inicializada, devolviendo null.');
    return null;
  }
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error en getUserIdFromSession:', error.code);
    return null;
  }
};

export default admin;
