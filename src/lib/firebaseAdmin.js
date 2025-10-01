
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = {
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        console.error('Firebase Admin initialization failed: Missing environment variables.');
        return null;
    }

    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully.');
        return app;
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
        return null;
    }
}

const adminApp = initializeAdminApp();

export const getUserIdFromSession = async () => {
  if (!adminApp) {
    console.error('getUserIdFromSession: Firebase Admin not initialized.');
    return null;
  }

  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Failed to verify session cookie:', error.code);
    return null;
  }
};

export default admin;
