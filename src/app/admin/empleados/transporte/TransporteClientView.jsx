'use client';

import { useState, useMemo } from 'react';
import { updateTurnoStatusByEmpleado } from '@/lib/actions/turnos.empleado.actions';

// --- Componente Reutilizable para las Tablas de Turnos ---
const TurnosTable = ({ title, turnos, tipo, onUpdateStatus }) => {
  const [loadingTurnoId, setLoadingTurnoId] = useState(null);

  const handleUpdate = async (turno, newStatus) => {
    setLoadingTurnoId(turno.id);
    try {
      // Pasamos los datos necesarios para la server action
      await onUpdateStatus(turno.clienteId, turno.mascotaId, turno.id, newStatus);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      setLoadingTurnoId(null); // Resetea el estado de carga en caso de error
    }
    // El estado de carga se resetea en el componente padre a través de la actualización del estado general
  };

  // Si no hay turnos, muestra un mensaje amigable
  if (turnos.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-3 text-cyan-400">{title}</h3>
        <p className="text-gray-400">No hay turnos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-cyan-400">{title}</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Mascota</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Dueño</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Dirección</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {turnos.map((turno) => (
              <tr key={turno.id} className="hover:bg-gray-700 transition-colors duration-150">
                <td className="px-4 py-4 text-white font-medium">{turno.mascota.nombre}</td>
                <td className="px-4 py-4 text-gray-300">{turno.user.nombre} {turno.user.apellido}</td>
                <td className="px-4 py-4 text-gray-300">{turno.user.telefono || 'N/A'}</td>
                <td className="px-4 py-4 text-gray-300">{turno.user.direccion || 'N/A'}</td>
                <td className="px-4 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-yellow-900">
                    {turno.estado}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {tipo === 'recogida' && turno.estado === 'confirmado' && (
                    <button
                      onClick={() => handleUpdate(turno, 'buscando')}
                      disabled={loadingTurnoId === turno.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {loadingTurnoId === turno.id ? 'Buscando...' : 'Iniciar Búsqueda'}
                    </button>
                  )}
                  {tipo === 'entrega' && turno.estado === 'peluqueria finalizada' && (
                     <button
                      onClick={() => handleUpdate(turno, 'retirado entregado')}
                      disabled={loadingTurnoId === turno.id}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {loadingTurnoId === turno.id ? 'Devolviendo...' : 'Iniciar Devolución'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- Componente Principal de la Vista del Cliente de Transporte ---
const TransporteClientView = ({ recogidas, entregas }) => {
    const [currentRecogidas, setCurrentRecogidas] = useState(recogidas);
    const [currentEntregas, setCurrentEntregas] = useState(entregas);

    // Función que se encarga de llamar a la server action y actualizar el estado local
    const handleStatusUpdate = async (userId, mascotaId, turnoId, newStatus) => {
        const result = await updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus });
        if (result.success) {
            // Actualización optimista: filtramos el turno que acaba de ser actualizado para que desaparezca de la UI
            if (newStatus === 'buscando') {
                setCurrentRecogidas(prev => prev.filter(t => t.id !== turnoId));
            } else if (newStatus === 'retirado entregado') {
                setCurrentEntregas(prev => prev.filter(t => t.id !== turnoId));
            }
        } else {
            console.error("Fallo al actualizar el turno:", result.error);
            // Aquí se podría implementar una notificación al usuario (ej: con una librería de toasts)
        }
    };

    // Usamos useMemo para evitar recalcular los filtros en cada render a menos que los datos cambien
    const turnosMañana = useMemo(() => ({
        recogidas: currentRecogidas.filter(t => t.horario === 'Mañana'),
        entregas: currentEntregas.filter(t => t.horario === 'Mañana')
    }), [currentRecogidas, currentEntregas]);

    const turnosTarde = useMemo(() => ({
        recogidas: currentRecogidas.filter(t => t.horario === 'Tarde'),
        entregas: currentEntregas.filter(t => t.horario === 'Tarde')
    }), [currentRecogidas, currentEntregas]);

    return (
        <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white">Panel de Transporte - Hoy</h1>

            <div className="space-y-12">
                {/* SECCIÓN MAÑANA */}
                <section id="jornada-manana">
                    <h2 className="text-2xl font-bold mb-6 text-purple-400 border-b-2 border-purple-500 pb-2">Turnos de Mañana</h2>
                    <div className="space-y-8">
                        <TurnosTable
                            title="Recogidas Pendientes"
                            turnos={turnosMañana.recogidas}
                            tipo="recogida"
                            onUpdateStatus={handleStatusUpdate}
                        />
                        <TurnosTable
                            title="Entregas Pendientes"
                            turnos={turnosMañana.entregas}
                            tipo="entrega"
                            onUpdateStatus={handleStatusUpdate}
                        />
                    </div>
                </section>

                {/* SECCIÓN TARDE */}
                <section id="jornada-tarde">
                    <h2 className="text-2xl font-bold mb-6 text-purple-400 border-b-2 border-purple-500 pb-2">Turnos de Tarde</h2>
                     <div className="space-y-8">
                        <TurnosTable
                            title="Recogidas Pendientes"
                            turnos={turnosTarde.recogidas}
                            tipo="recogida"
                            onUpdateStatus={handleStatusUpdate}
                        />
                        <TurnosTable
                            title="Entregas Pendientes"
                            turnos={turnosTarde.entregas}
                            tipo="entrega"
                            onUpdateStatus={handleStatusUpdate}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TransporteClientView;
