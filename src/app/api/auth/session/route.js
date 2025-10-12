
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// --- INICIALIZACIÓN ROBUSTA DE FIREBASE ADMIN ---
// Esto garantiza que el SDK de Admin esté listo antes de usarlo.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Inicializa la app solo si no se ha hecho antes.
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado para la ruta de sesión.');
  } catch (error) {
    console.error("Error al inicializar Firebase Admin SDK en la ruta de sesión:", error);
  }
}

// --- FIN DE LA INICIALIZACIÓN ---

// Duración de la cookie de sesión (5 días en segundos)
const expiresIn = 60 * 60 * 24 * 5;

/**
 * Maneja la creación de la cookie de sesión (Login)
 */
export async function POST(request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization) {
    return NextResponse.json({ error: 'Token no proporcionado.' }, { status: 401 });
  }

  const match = authorization.match(/^Bearer\s+(.*)$/i);
  if (!match) {
    return NextResponse.json({ error: 'Formato de token inválido.' }, { status: 401 });
  }
  const idToken = match[1];

  try {
    // Usamos getAuth() para obtener la instancia de Auth del SDK inicializado
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    // Devuelve un error más específico si es posible
    if (error.code === 'auth/invalid-id-token') {
        return NextResponse.json({ error: 'El token de ID es inválido o ha expirado.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Autenticación fallida.' }, { status: 401 });
  }
}

/**
 * Maneja la eliminación de la cookie de sesión (Logout)
 */
export async function DELETE(request) {
  cookies().set('__session', '', {
    maxAge: -1,
    path: '/',
  });

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
