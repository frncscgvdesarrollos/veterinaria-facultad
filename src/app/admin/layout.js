
import Link from 'next/link';
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaDog, FaCog } from 'react-icons/fa';

const SidebarLink = ({ icon, text, href, active }) => {
    const Icon = icon;
    return (
        <Link href={href}>
            <span className={`flex items-center p-3 my-1 rounded-lg text-white transition-colors duration-200 ${active ? 'bg-gray-700' : 'hover:bg-gray-600'}`}>
                <Icon className="text-xl" />
                <span className="ml-4 font-medium">{text}</span>
            </span>
        </Link>
    );
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 fixed h-full">
        <div className="mb-8">
          <Link href="/admin">
            <span className="text-2xl font-bold tracking-wider">AdminPanel</span>
          </Link>
        </div>
        <nav>
            <SidebarLink icon={FaTachometerAlt} text="Dashboard" href="/admin" active />
            <SidebarLink icon={FaCalendarAlt} text="Turnos" href="/admin/turnos" />
            <SidebarLink icon={FaUsers} text="Clientes" href="/admin/clientes" />
            <SidebarLink icon={FaDog} text="Pacientes" href="/admin/pacientes" />
            <SidebarLink icon={FaCog} text="Configuración" href="/admin/configuracion" />
        </nav>
        <div className="mt-auto">
            {/* Puedes agregar un link al perfil o un botón de cerrar sesión aquí */}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
