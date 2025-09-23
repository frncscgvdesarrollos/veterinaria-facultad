import { getCurrentUser } from '@/lib/session';
import Dashboard from '@/app/components/Dashboard';
import Link from 'next/link';
import Image from 'next/image';
// ELIMINADA LA IMPORTACIÓN DE SUBHEADER

export default async function HomePage() {
    const user = await getCurrentUser();

    // Si hay usuario, solo mostramos el Dashboard.
    // El SubHeader ahora se gestiona globalmente desde el layout.
    if (user) {
        return <Dashboard />;
    }

    // Si no hay usuario, se muestra la página de bienvenida.
    return (
        <div 
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/patron1.jpg')" }}
        >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 bg-white bg-opacity-80 p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <Image src="/LOGO.svg" alt="Magalí Martin Veterinaria" width={250} height={100} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    ¡Bienvenido a la <span className="text-cyan-600">Veterinaria Online</span>!
                </h1>
                <p className="text-gray-600 mb-3">
                    Aquí puedes encontrar la mejor atención para tus mascotas.
                </p>
                <p className="text-gray-600 mb-3">
                    Reservar turnos para la veterinaria y la peluquería de tus mascotas.
                </p>
                <p className="text-gray-600 mb-8">
                    Realizar compras y ver mascotas en adopción.
                </p>
                <Link 
                    href="/login"
                    className="w-full inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
                >
                    Ingresar
                </Link>
            </div>
        </div>
    );
}
