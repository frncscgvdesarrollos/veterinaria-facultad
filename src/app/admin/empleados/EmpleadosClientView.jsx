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
  const [emailFilter, setEmailFilter] = useState(''); // Estado para el filtro de email

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
    }

    setLoading(false);
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const rolesDisponibles = ['dueño', 'admin', 'peluqueria', 'transporte'];

  // Lógica para filtrar los usuarios por email
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        {/* Input para el filtro de email */}
        <input
          type="text"
          placeholder="Filtrar por email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="block w-full max-w-sm pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      {feedback.message && (
        <div className="p-4 border-t border-gray-200">
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
            {/* Mapear sobre los usuarios filtrados */}
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role || 'dueño'}
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
