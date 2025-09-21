import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Parsea las credenciales de Firebase desde el entorno
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Inicializa Firebase Admin si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore = admin.firestore();

async function seedDatabase() {
  try {
    const batch = firestore.batch();

    // 1. Crear usuarios con diferentes roles
    const users = [
      { uid: 'fake-client-1', displayName: 'Juan Perez', email: 'juan.perez@example.com', dni: '12345678', phone: '1122334455', role: 'cliente', profileCompleted: true },
      { uid: 'fake-peluquera-1', displayName: 'Maria Gomez', email: 'maria.gomez@example.com', dni: '00.000.002', phone: '1133445566', role: 'peluquera', profileCompleted: true },
      { uid: 'fake-transporte-1', displayName: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', dni: '00.000.003', phone: '1144556677', role: 'transporte', profileCompleted: true },
      { uid: 'fake-admin-1', displayName: 'Magali', email: 'magali@example.com', dni: '00.000.001', phone: '1155667788', role: 'admin', profileCompleted: true }
    ];

    for (const user of users) {
        const userRef = firestore.collection('users').doc(user.uid);
        batch.set(userRef, user);

        // Asignar Custom Claim para el rol
        await admin.auth().setCustomUserClaims(user.uid, { role: user.role });
    }

    // 2. Crear una mascota para el cliente
    const mascotaRef = firestore.collection('users').doc('fake-client-1').collection('mascotas').doc('mascota-1');
    batch.set(mascotaRef, {
      nombre: 'Firu',
      especie: 'Perro',
      raza: 'Mestizo',
      fechaNacimiento: '2022-01-15',
      enAdopcion: false
    });
    
    // 3. Crear otra mascota en adopcion
    const mascotaAdopcionRef = firestore.collection('users').doc('fake-client-1').collection('mascotas').doc('mascota-2');
    batch.set(mascotaAdopcionRef, {
        nombre: 'Mishi',
        especie: 'Gato',
        raza: 'Siames',
        fechaNacimiento: '2023-05-20',
        enAdopcion: true
    });

    // Ejecutar el batch
    await batch.commit();
    console.log('Base de datos sembrada con éxito.');

  } catch (error) {
    console.error('Error sembrando la base de datos:', error);
  } finally {
    // Cierra la conexión de Firebase para que el script termine limpiamente
    admin.app().delete();
  }
}

seedDatabase();
