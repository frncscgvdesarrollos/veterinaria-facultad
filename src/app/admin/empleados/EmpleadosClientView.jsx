
'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/actions/admin.actions';

// Componente para mostrar mensajes de feedback (éxito o error)
const FeedbackMessage = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium';
  const typeClasses = type === 'success' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default function EmpleadosClientView({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleSaveChanges = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setLoading(true);
    setFeedback({ message: '', type: '' });

    const result = await updateUserRole(userId, user.role);

    if (result.success) {
      setFeedback({ message: `Rol de ${user.nombre} actualizado con éxito.`, type: 'success' });
    } else {
      setFeedback({ message: `Error: ${result.error}`, type: 'error' });
      // Opcional: Revertir el cambio en la UI si la actualización falla
      // Para ello, necesitaríamos una copia del estado original.
    }

    setLoading(false);
    // Ocultar el mensaje después de unos segundos
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const rolesDisponibles = ['dueño', 'admin', 'peluqueria', 'transporte'];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {feedback.message && (
        <div className="p-4">
          <FeedbackMessage message={feedback.message} type={feedback.type} />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Guardar</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role || 'dueño'} // Asigna 'dueño' si el rol no está definido
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {rolesDisponibles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)} 
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleSaveChanges(user.id)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
