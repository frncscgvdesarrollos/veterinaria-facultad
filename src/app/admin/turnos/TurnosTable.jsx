
'use client';

import { FaCheck, FaTimes, FaDog, FaCat } from 'react-icons/fa';

export default function TurnosTable({ turnos, onUpdate, isUpdating, currentView }) {
  const statusStyles = {
    pendiente: 'bg-yellow-200 text-yellow-800',
    confirmado: 'bg-blue-200 text-blue-800',
    finalizado: 'bg-green-200 text-green-800',
    cancelado: 'bg-red-200 text-red-800',
    reprogramado: 'bg-orange-200 text-orange-800',
    buscando: 'bg-cyan-200 text-cyan-800',
    buscado: 'bg-sky-200 text-sky-800',
    veterinaria: 'bg-indigo-200 text-indigo-800',
    'peluqueria iniciada': 'bg-pink-200 text-pink-800',
    'peluqueria finalizada': 'bg-purple-200 text-purple-800',
    devolviendo: 'bg-amber-200 text-amber-800',
    'servicio terminado': 'bg-green-200 text-green-800',
  };

  const handleAction = (turno, newStatus) => {
    onUpdate(turno.userId, turno.mascotaId, turno.id, newStatus);
  };

  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' hs';
  };

  if (turnos.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No hay turnos para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dueño</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {turnos.map((turno) => (
            <tr key={turno.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
                    {turno.mascota.especie.toLowerCase() === 'perro' ? <FaDog className="h-6 w-6 text-gray-600" /> : <FaCat className="h-6 w-6 text-gray-600" />}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{turno.mascota.nombre}</div>
                    <div className="text-sm text-gray-500">{turno.mascota.raza}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{turno.user.nombre} {turno.user.apellido}</div>
                <div className="text-sm text-gray-500">{turno.user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{turno.servicioNombre}</div>
                <div className="text-sm text-gray-500">{turno.tipo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate(turno.fecha)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[turno.estado] || 'bg-gray-200 text-gray-800'}`}>
                  {turno.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-2">
                  {isUpdating && <span className="text-sm text-gray-500">...</span>}
                  {!isUpdating && (
                    <>
                      {currentView === 'proximos' && turno.estado === 'pendiente' && (
                        <button onClick={() => handleAction(turno, 'confirmado')} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors" title="Confirmar">
                          <FaCheck />
                        </button>
                      )}
                      {currentView === 'hoy' && turno.estado === 'confirmado' && (
                        <button onClick={() => handleAction(turno, 'finalizado')} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors" title="Finalizar">
                          <FaCheck />
                        </button>
                      )}
                      {currentView !== 'finalizados' && turno.estado !== 'cancelado' && (
                        <button onClick={() => handleAction(turno, 'cancelado')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Cancelar">
                          <FaTimes />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
