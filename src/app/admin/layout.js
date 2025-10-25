'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaConciergeBell, FaBars, FaTimes } from 'react-icons/fa';

// Componente de enlace reutilizable
const SidebarLink = ({ icon: Icon, text, href, active, isCollapsed }) => (
    <Link href={href}>
        <span className={`flex items-center p-3 my-1 rounded-lg text-white transition-colors duration-200 ${active ? 'bg-blue-700' : 'hover:bg-blue-600'}`}>
            <Icon className="text-xl" />
            {!isCollapsed && <span className="ml-4 font-medium">{text}</span>}
        </span>
    </Link>
);

// Layout principal del panel de administración
export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* --- Sidebar para Escritorio --- */}
      <aside className={`bg-gray-900 text-white flex-col p-4 fixed h-full shadow-lg z-20 hidden md:flex transition-width duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <Link href="/admin">
              <span className="text-2xl font-bold tracking-wider text-blue-400">AdminPanel</span>
            </Link>
          )}
          <button onClick={toggleSidebar} className="text-white hover:text-blue-300 focus:outline-none">
            {isCollapsed ? <FaBars className="text-2xl" /> : <FaTimes className="text-2xl" />}
          </button>
        </div>
        <nav>
          <SidebarLink icon={FaTachometerAlt} text="Dashboard" href="/admin" isCollapsed={isCollapsed} active />
          <SidebarLink icon={FaCalendarAlt} text="Turnos" href="/admin/turnos" isCollapsed={isCollapsed} />
          <SidebarLink icon={FaUsers} text="Clientes" href="/admin/clientes" isCollapsed={isCollapsed} />
          <SidebarLink icon={FaConciergeBell} text="Servicios" href="/admin/servicios" isCollapsed={isCollapsed} />
        </nav>
      </aside>

      {/* --- Sidebar para Móvil --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileMenu}></div>
      )}
      <aside className={`bg-gray-900 text-white flex flex-col p-4 fixed h-full shadow-lg z-40 md:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
        <div className="flex items-center justify-between mb-8">
            <Link href="/admin">
              <span className="text-2xl font-bold tracking-wider text-blue-400">AdminPanel</span>
            </Link>
            <button onClick={toggleMobileMenu} className="text-white hover:text-blue-300 focus:outline-none">
                <FaTimes className="text-2xl" />
            </button>
        </div>
        <nav>
          <SidebarLink icon={FaTachometerAlt} text="Dashboard" href="/admin" />
          <SidebarLink icon={FaCalendarAlt} text="Turnos" href="/admin/turnos" />
          <SidebarLink icon={FaUsers} text="Clientes" href="/admin/clientes" />
          <SidebarLink icon={FaConciergeBell} text="Servicios" href="/admin/servicios" />
        </nav>
      </aside>

      {/* --- Contenido Principal --- */}
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Botón de hamburguesa para móvil */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md">
            <Link href="/admin">
                <span className="text-xl font-bold text-blue-500">Admin</span>
            </Link>
            <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
                <FaBars className="text-2xl" />
            </button>
        </div>
        <div className="p-2 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
