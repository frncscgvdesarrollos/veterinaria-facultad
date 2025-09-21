
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const firestore = admin.firestore();
    const auth = admin.auth();
    const batch = firestore.batch();

    // Datos de usuarios y mascotas
    const users = [
        { uid: 'fake-client-1', displayName: 'Juan Perez', email: 'juan.perez@example.com', dni: '12345678', phone: '1122334455', role: 'cliente', profileCompleted: true },
        { uid: 'fake-peluquera-1', displayName: 'Maria Gomez', email: 'maria.gomez@example.com', dni: '00.000.002', phone: '1133445566', role: 'peluquera', profileCompleted: true },
        { uid: 'fake-transporte-1', displayName: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', dni: '00.000.003', phone: '1144556677', role: 'transporte', profileCompleted: true },
        { uid: 'fake-admin-1', displayName: 'Magali', email: 'magali@example.com', dni: '00.000.001', phone: '1155667788', role: 'admin', profileCompleted: true }
    ];

    for (const userData of users) {
      const userRef = firestore.collection('users').doc(userData.uid);
      batch.set(userRef, userData);
      // Asignar custom claims para controlar roles
      await auth.setCustomUserClaims(userData.uid, { role: userData.role });
    }

    const mascotaRef = firestore.collection('users').doc('fake-client-1').collection('mascotas').doc('mascota-1');
    batch.set(mascotaRef, {
        nombre: 'Firu',
        especie: 'Perro',
        raza: 'Mestizo',
        fechaNacimiento: '2022-01-15',
        enAdopcion: false
    });

    const mascotaAdopcionRef = firestore.collection('users').doc('fake-client-1').collection('mascotas').doc('mascota-2');
    batch.set(mascotaAdopcionRef, {
        nombre: 'Mishi',
        especie: 'Gato',
        raza: 'Siames',
        fechaNacimiento: '2023-05-20',
        enAdopcion: true
    });

    await batch.commit();

    return NextResponse.json({ message: 'Base de datos sembrada con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error en la ruta de siembra:', error);
    return NextResponse.json({ error: 'Error sembrando la base de datos.', details: error.message }, { status: 500 });
  }
}
