
import { getAllUsers } from '@/lib/actions/admin.actions';
import EmpleadosClientView from './EmpleadosClientView';

async function EmpleadosPage() {
  // Al ser un Server Component, podemos hacer el fetch de datos directamente.
  const users = await getAllUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Empleados y Roles</h1>
      
      <p className="mb-8 text-gray-600">
        Aquí puedes asignar roles a los usuarios del sistema. Los roles determinan los permisos y accesos dentro de la aplicación.
      </p>

      {/* 
        Pasamos los datos obtenidos en el servidor a un Componente de Cliente.
        Esto permite que la página se cargue rápidamente con los datos iniciales,
        y luego el cliente se encarga de la interactividad (cambiar roles, guardar, etc.).
      */}
      <EmpleadosClientView initialUsers={users} />
      
    </div>
  );
}

export default EmpleadosPage;
