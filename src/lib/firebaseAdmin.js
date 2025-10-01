
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- INICIALIZACIÓN DEL SDK DE ADMIN (MÉTODO ROBUSTO Y CENTRALIZADO) ---

// Construir el objeto de la cuenta de servicio a partir de variables de entorno individuales.
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

// Inicializar la app de Firebase Admin SÓLO UNA VEZ
if (!admin.apps.length) {
  if (serviceAccount.private_key && serviceAccount.project_id) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error al inicializar Firebase Admin SDK:', error.message);
    }
  }
}

export default admin;
