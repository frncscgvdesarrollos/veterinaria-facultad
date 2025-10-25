
import { FaBell, FaBoxOpen, FaCog } from 'react-icons/fa';

const Card = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        {children}
    </div>
);

const InfoLink = ({ text, icon: Icon }) => (
    <div className="flex items-center p-3 my-1 rounded-lg text-gray-600">
        <Icon className="text-xl text-gray-400" />
        <span className="ml-4 font-medium">{text}</span>
    </div>
);

export default function AdminDashboardPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Panel de Control</h1>
            <p className="text-gray-500 mt-1">Bienvenida, Magali. Selecciona una opción.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Próximas Secciones">
                <div className="space-y-2">
                    <InfoLink icon={FaBell} text="Notificaciones" />
                    <InfoLink icon={FaBoxOpen} text="Caja" />
                    <InfoLink icon={FaCog} text="Configuración" />
                </div>
                <p className="text-gray-400 mt-4 text-sm">Estas secciones estarán disponibles próximamente.</p>
            </Card>
            {/* Aquí se pueden añadir más cards para el dashboard */}
        </div>
    </div>
  );
}
