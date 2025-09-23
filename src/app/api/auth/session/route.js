// src/app/api/auth/session/route.js

import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';

// Duración de la cookie de sesión (5 días en segundos)
const expiresIn = 60 * 60 * 24 * 5;

/**
 * Maneja la creación de la cookie de sesión (Login)
 */
export async function POST(request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token no proporcionado.' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    // Verificar el token ID y crear la cookie de sesión
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // El SDK de Admin debe estar inicializado para que esto funcione
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });

    // CORREGIDO: Establecer la cookie con el prefijo de seguridad __session
    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn, // Tiempo de vida de la cookie
      httpOnly: true, // La cookie no es accesible desde el JavaScript del cliente
      secure: process.env.NODE_ENV === 'production', // Solo enviar por HTTPS en producción
      path: '/', // Disponible en todo el sitio
      sameSite: 'lax', // Protección contra ataques CSRF
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    // Este error es crítico y a menudo apunta a un problema con la inicialización del Admin SDK
    if (error.code === 'auth/argument-error' || error.message.includes('Firebase App is not an App')) {
        return NextResponse.json({
             error: 'El Admin SDK de Firebase no se ha inicializado correctamente en el servidor. Verifica las variables de entorno en Vercel.'
             }, { status: 500 });
    }
    return NextResponse.json({ error: 'Autenticación fallida.' }, { status: 401 });
  }
}

/**
 * Maneja la eliminación de la cookie de sesión (Logout)
 */
export async function DELETE(request) {
  // CORREGIDO: Borrar la cookie con el prefijo de seguridad __session
  cookies().set('__session', '', {
    maxAge: -1, 
    path: '/',
  });

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
