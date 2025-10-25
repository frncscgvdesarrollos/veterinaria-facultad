
import Link from 'next/link';
import { FaBell, FaBoxOpen, FaCog } from 'react-icons/fa';

const TabLink = ({ href, icon, text }) => {
    const Icon = icon;
    return (
        <Link href={href}>
            <span className="flex items-center p-3 my-1 rounded-lg text-white transition-colors duration-200 hover:bg-gray-700">
                <Icon className="text-xl" />
                <span className="ml-4 font-medium">{text}</span>
            </span>
        </Link>
    )
}


export default function AdminDashboardPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Panel de Control</h1>
            <p className="text-gray-400 mt-1">Bienvenida, Magali. Selecciona una opción.</p>
        </div>

        {/* --- Navigation Tabs --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Próximas Secciones</h2>
                <div className="space-y-2">
                   <TabLink href="#" icon={FaBell} text="Notificaciones" />
                   <TabLink href="#" icon={FaBoxOpen} text="Caja" />
                   <TabLink href="#" icon={FaCog} text="Configuración" />
                </div>
                 <p className="text-gray-400 mt-4 text-sm">Estas secciones estarán disponibles próximamente.</p>
             </div>
        </div>

      </main>
    </div>
  );
}
