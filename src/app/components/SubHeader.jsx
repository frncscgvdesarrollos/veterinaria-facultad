import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaPaw, FaCalendarAlt } from 'react-icons/fa';

const SubHeader = ({ title }) => {
    const pathname = usePathname();

    const baseStyle = "flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300";
    const activeStyle = "flex items-center text-blue-600 font-bold";

    const getLinkClass = (path) => {
        // La ruta de mascotas es un caso especial, debe incluir subrutas.
        if (path === '/mascotas' && pathname.startsWith('/mascotas')) {
            return activeStyle;
        }
        if (pathname === path) {
            return activeStyle;
        }
        return baseStyle;
    };

    return (
        <header className="bg-white shadow-md sticky top-16 md:top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    <div className="flex space-x-6 md:space-x-10">
                        <Link href="/mis-datos" className={getLinkClass('/mis-datos')}>
                            <FaUser className="mr-2" />
                            <span className="hidden md:inline">Mis Datos</span>
                        </Link>
                        <Link href="/mascotas" className={getLinkClass('/mascotas')}>
                             <FaPaw className="mr-2" />
                            <span className="hidden md:inline">Mis Mascotas</span>
                        </Link>
                        {/* CORRECCIÓN: El href debe coincidir con la lógica del path para el estilo activo */}
                        <Link href="/turnos/mis-turnos" className={getLinkClass('/turnos/mis-turnos')}>
                             <FaCalendarAlt className="mr-2" />
                           <span className="hidden md:inline">Mis Turnos</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SubHeader;
