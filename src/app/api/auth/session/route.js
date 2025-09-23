// src/app/api/auth/session/route.js

import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth'; // Importación corregida
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app'; // Necesario para inicializar

// Duración de la cookie de sesión (5 días en segundos)
const expiresIn = 60 * 60 * 24 * 5;

// Inicialización del SDK de Admin (solo se ejecuta una vez)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

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
    // Usar getAuth() para acceder a los métodos de autenticación de admin
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });

    // Establecer la cookie de forma segura
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
    return NextResponse.json({ error: 'Autenticación fallida.' }, { status: 401 });
  }
}

/**
 * Maneja la eliminación de la cookie de sesión (Logout)
 */
export async function DELETE(request) {
  // Borrar la cookie
  cookies().set('__session', '', {
    maxAge: -1, 
    path: '/',
  });

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
