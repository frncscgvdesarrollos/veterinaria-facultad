import admin from 'firebase-admin';

// Evita reinicializaciones que pueden ocurrir en entornos de desarrollo con hot-reloading.
if (!admin.apps.length) {
  try {
    // MÉTODO 1: Variable de Entorno Única (Recomendado para Producción/Vercel)
    // Lee la variable que contiene el JSON completo de la clave de servicio.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parsea el contenido de la variable de entorno, que es un string JSON.
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK inicializado correctamente desde la variable de entorno (PRODUCCIÓN).');
    } else {
      // MÉTODO 2: Archivo de Cuentas de Servicio (Fallback para Desarrollo Local)
      // Si la variable de entorno no está, se recurre al archivo JSON local.
      const serviceAccount = require('../../firebase-admin-sdk.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK inicializado desde archivo local (DESARROLLO).');
    }
  } catch (error) {
    // Si ninguno de los dos métodos funciona, es un error crítico.
    console.error('Error FATAL: No se pudo inicializar Firebase Admin SDK. Verifique la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY o el archivo firebase-admin-sdk.json.', error);
  }
}

// Exporta la instancia de admin para ser usada en todas las Server Actions.
export default admin;
