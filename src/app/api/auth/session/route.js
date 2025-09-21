
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';


const expiresIn = 60 * 60 * 24 * 5;


export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }


    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });


    const response = NextResponse.json({ status: 'success' });


    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,     
      secure: process.env.NODE_ENV === 'production', 
      maxAge: expiresIn,  
      path: '/',         
      sameSite: 'lax',
    })   

    return response;

  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}

export async function DELETE() {
  try {

    const response = NextResponse.json({ status: 'success' });

    response.cookies.set('__session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Error clearing session cookie:', error);
    return NextResponse.json({ error: 'Failed to clear session.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'success' });
}