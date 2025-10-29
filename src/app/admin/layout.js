'use client'
import Link from 'next/link';
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaConciergeBell } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext'; // Ajusta la ruta a tu AuthContext
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SidebarLink = ({ icon: Icon, text, href }) => (
    <Link href={href}>
        <div className="flex items-center p-3 my-2 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200">
            <Icon className="text-xl" />
            <span className="ml-4 font-medium">{text}</span>
        </div>
    </Link>
);

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const allowedRoles = ['admin', 'peluqueria', 'transporte'];

    useEffect(() => {
        if (!loading) {
            if (!user || !allowedRoles.includes(user?.role)) {
                router.push('/');
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading || !user || !allowedRoles.includes(user?.role)) {
        return (
             <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p>Verificando acceso...</p> 
            </div>
        );
    }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex-col p-4 hidden md:flex">
        <div className="mb-10">
            <Link href="/admin">
              <span className="text-2xl font-bold text-white">Panel de Admin</span>
            </Link>
        </div>
        <nav>
          <SidebarLink icon={FaTachometerAlt} text="Dashboard" href="/admin" />
          <SidebarLink icon={FaCalendarAlt} text="Turnos" href="/admin/turnos" />
          <SidebarLink icon={FaUsers} text="Clientes" href="/admin/clientes" />
          <SidebarLink icon={FaConciergeBell} text="Servicios" href="/admin/servicios" />
        </nav>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900">
        <header className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
        </header>
        {children}
      </main>
    </div>
  );
}
