
import { cookies } from 'next/headers';
import { getMascotasDelUsuario } from '@/lib/actions/mascotas.actions';
import { obtenerServicios } from '@/lib/actions/servicios.actions';
import FormularioTurno from './FormularioTurno';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import admin from '@/lib/firebaseAdmin'; // Usamos admin para verificar el token

async function getUserSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    // Verificamos la cookie de sesión. El `true` al final comprueba si ha sido revocada.
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    // La cookie es inválida (expirada, manipulada, etc.)
    console.error("Error al verificar la cookie de sesión:", error);
    return null;
  }
}

export default async function NuevoTurnoPage() {
  const user = await getUserSession();

  // Si no hay una sesión de usuario activa, redirigimos a login.
  if (!user) {
    redirect('/login?redirectTo=/turnos/nuevo');
  }

  // Obtenemos las mascotas y los servicios en paralelo para mayor eficiencia.
  const [mascotasResult, servicios] = await Promise.all([
    getMascotasDelUsuario(user),
    obtenerServicios()
  ]);

  const mascotas = mascotasResult.success ? mascotasResult.mascotas : [];

  // Si el usuario no tiene mascotas, mostramos un mensaje para que registre una.
  if (mascotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Aún no tienes mascotas registradas</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Para poder solicitar un turno, primero necesitas añadir a tu compañero. ¡Es muy fácil!
        </p>
        <Link href="/mis-mascotas/nuevo" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          Registrar mi Mascota
        </Link>
      </div>
    );
  }

  // Si todo está en orden, renderizamos el formulario.
  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 md:p-12 max-w-4xl mx-auto">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Solicita un Nuevo Turno</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
            Elige el servicio y la mascota para encontrar el mejor momento.
          </p>
        </div>
        
        <FormularioTurno
          user={user}
          mascotas={mascotas}
          servicios={servicios || { peluqueria: {}, clinica: {} }}
        />
      </div>
    </section>
  );
}
