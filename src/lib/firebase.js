import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

let app;
let auth;
let db;

// Si la app de Firebase ya fue inicializada, usamos la instancia existente.
// Esto es clave para evitar errores en Next.js con el Fast Refresh y en entornos de renderizado de servidor.
if (getApps().length > 0) {
  app = getApp();
} else {
  // Si no, inicializamos la app por primera vez.
  app = initializeApp(firebaseConfig);
}

// Obtenemos las instancias de los servicios usando la app (ya sea nueva o existente).
db = getFirestore(app);
auth = getAuth(app);

// Exportamos las instancias listas para ser usadas.
export { db, auth, app };
