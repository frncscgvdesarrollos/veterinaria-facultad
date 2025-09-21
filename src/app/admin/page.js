
import { FaChartBar, FaUsers, FaClipboardList } from 'react-icons/fa';

const StatCard = ({ icon, title, value, color }) => {
    const IconComponent = icon;
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
            <div className="text-3xl">{<IconComponent />}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600 mb-8">Bienvenida, Magali. Aquí tienes un resumen de la actividad de hoy.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjetas de Estadísticas */}
            <StatCard icon={FaClipboardList} title="Turnos Pendientes" value="12" color="border-blue-500" />
            <StatCard icon={FaUsers} title="Nuevos Clientes" value="5" color="border-green-500" />
            <StatCard icon={FaChartBar} title="Ingresos del Día" value="$1,250" color="border-yellow-500" />
        </div>

        {/* Próxima sección: Lista de turnos recientes */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-gray-500">Aquí se mostrará una lista de los últimos turnos y actividades...</p>
                {/* Aquí iría el componente de la lista de turnos */}
            </div>
        </div>
      </div>
    </div>
  );
}
