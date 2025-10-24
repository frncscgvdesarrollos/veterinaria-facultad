import { FaChartPie, FaUsers, FaClipboardList, FaArrowRight, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

// --- NUEVO: Tarjetas de Estadísticas Rediseñadas ---
// Más visuales, con degradados y mejores efectos de hover.
const StatCard = ({ icon, title, value, link, color }) => {
  const IconComponent = icon;
  const colors = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
  };

  return (
    <Link href={link} className="block group">
      <div className={`relative p-6 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 transition-all duration-300 hover:border-gray-500 hover:-translate-y-1`}>
          <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${colors[color]}`}></div>
          <div className="flex justify-between items-start">
              <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-400">{title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-700`}>
                  <IconComponent className={`text-xl text-${color}-400`} />
              </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
              Ver detalles <FaArrowRight className="ml-2" />
          </div>
      </div>
    </Link>
  );
};

// --- NUEVO: Ítem de Actividad para la lista ---
// Componente individual para cada turno en la lista de actividad reciente.
const ActivityItem = ({ turno }) => {
    const statusInfo = {
        confirmado: { icon: FaCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
        pendiente: { icon: FaExclamationCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        'en progreso': { icon: FaClock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    };
    const currentStatus = statusInfo[turno.estado] || statusInfo.pendiente;
    const IconComponent = currentStatus.icon;

    return (
        <div className="grid grid-cols-3 md:grid-cols-5 items-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200 border border-transparent hover:border-gray-700">
            {/* Info Mascota y Cliente (Visible en todos los tamaños) */}
            <div className="col-span-2 md:col-span-2 flex flex-col">
                <p className="font-bold text-white">{turno.mascota}</p>
                <p className="text-sm text-gray-400">{turno.cliente}</p>
            </div>
            
            {/* Servicio (Visible en Desktop) */}
            <div className="hidden md:block">
                <p className="text-white">{turno.servicio}</p>
            </div>

            {/* Horario (Visible en Desktop) */}
            <div className="hidden md:block">
                <p className="text-gray-300">{turno.horario}</p>
            </div>
            
            {/* Estado (con icono y texto) */}
            <div className="flex justify-end items-center">
                <div className={`flex items-center space-x-2 py-1 px-3 rounded-full ${currentStatus.bg}`}>
                    <IconComponent className={currentStatus.color} />
                    <span className={`font-medium text-sm capitalize ${currentStatus.color}`}>{turno.estado}</span>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    // Datos de ejemplo para el diseño
    const recentActivity = [
        { id: 1, mascota: 'Rocky', cliente: 'Juan Pérez', servicio: 'Corte y Baño', horario: '10:00 AM', estado: 'confirmado' },
        { id: 2, mascota: 'Luna', cliente: 'Ana Gómez', servicio: 'Consulta Clínica', horario: '11:30 AM', estado: 'en progreso' },
        { id: 3, mascota: 'Thor', cliente: 'Carlos Ruiz', servicio: 'Vacunación', horario: '1:00 PM', estado: 'pendiente' },
        { id: 4, mascota: 'Nala', cliente: 'Sofía Castro', servicio: 'Guardería', horario: 'Todo el día', estado: 'confirmado' },
    ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Panel de Control</h1>
            <p className="text-gray-400 mt-1">Bienvenida, Magali. Aquí tienes un resumen de la actividad.</p>
        </div>
        
        {/* --- Grid de Tarjetas de Estadísticas --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={FaClipboardList} title="Turnos Pendientes" value="12" link="/admin/turnos" color="yellow" />
            <StatCard icon={FaUsers} title="Nuevos Clientes Hoy" value="5" link="/admin/clientes" color="green" />
            <StatCard icon={FaChartPie} title="Ingresos del Día" value="$1,250" link="/admin/reportes" color="blue" />
        </div>

        {/* --- Sección de Actividad Reciente --- */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Actividad de Hoy</h2>
            
            <div className="bg-gray-800/30 p-2 rounded-xl">
                 {/* Header de la tabla (solo visible en desktop) */}
                <div className="hidden md:grid grid-cols-5 p-4 text-sm font-semibold text-gray-400">
                    <h3 className="col-span-2">Cliente / Mascota</h3>
                    <h3>Servicio</h3>
                    <h3>Horario</h3>
                    <h3 className="text-right">Estado</h3>
                </div>
                
                {/* Lista de Actividades */}
                <div className="space-y-2">
                    {recentActivity.map(turno => (
                        <ActivityItem key={turno.id} turno={turno} />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
