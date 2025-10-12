
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin'; // Importa la instancia de admin ya inicializada
import { cookies } from 'next/headers';

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

  // Expresión regular para extraer el token de forma robusta
  const match = authorization.match(/^Bearer\s+(.*)$/i);
  if (!match) {
    return NextResponse.json({ error: 'Formato de token inválido.' }, { status: 401 });
  }
  const idToken = match[1];

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });

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
  cookies().set('__session', '', {
    maxAge: -1,
    path: '/',
  });

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
