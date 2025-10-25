import { getAllUsers } from '@/lib/actions/admin.actions.js';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function ClientesPage() {
  const result = await getAllUsers();

  if (result.error || !Array.isArray(result)) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <Link href="/admin">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                        <FaArrowLeft className="mr-2" />
                        Volver al Panel Principal
                    </span>
                </Link>
            </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-red-500">{result.error || "No se pudieron cargar los clientes."}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const users = result;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
            <Link href="/admin">
                <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                    <FaArrowLeft className="mr-2" />
                    Volver al Panel Principal
                </span>
            </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600 mb-8">Aquí podrás ver y administrar la información de los dueños de las mascotas.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay clientes registrados.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.nombre || 'No especificado'} {user.apellido}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/clientes/${user.id}`} className="text-indigo-600 hover:text-indigo-900">Ver</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
