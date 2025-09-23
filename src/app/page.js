import { cookies } from 'next/headers';
import Dashboard from '@/app/components/Dashboard';
import LandingPage from '@/app/components/LandingPage';

// Esta página actúa como un enrutador del lado del servidor.
// Lee la cookie de sesión para decidir qué componente renderizar
// antes de enviar la página al cliente.

async function checkUserSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('__session');
  
  // La presencia de la cookie __session es nuestro indicador de que el usuario está logueado.
  // La validación real del token se maneja en el middleware y en las rutas de API seguras.
  return sessionCookie ? { isLoggedIn: true } : { isLoggedIn: false };
}

export default async function HomePage() {
    const { isLoggedIn } = await checkUserSession();

    // Si el usuario tiene una sesión activa, se le muestra el Dashboard principal de la aplicación.
    if (isLoggedIn) {
        return <Dashboard />;
    }

    // Si el usuario no tiene una sesión, se le muestra la página de bienvenida (Landing Page).
    return <LandingPage />;
}
