'use client';

import { useState } from 'react';
import { updateTurnoStatusByEmpleado } from '@/lib/actions/turnos.empleado.actions';

const TurnoCard = ({ turno, onUpdateStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newStatus) => {
    setIsLoading(true);
    try {
      await onUpdateStatus(turno.clienteId, turno.mascotaId, turno.id, newStatus);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      // Aquí podrías mostrar una notificación al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-bold text-white">{turno.mascota.nombre}</h3>
      <p className="text-sm text-gray-400">Dueño: {turno.user.nombre} {turno.user.apellido}</p>
      <p className="text-sm text-gray-400">Estado actual: <span className="font-semibold text-yellow-400">{turno.estado}</span></p>
      
      <div className="mt-4 flex gap-2">
        {turno.estado === 'confirmado' && (
          <button 
            onClick={() => handleUpdate('buscando')} 
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-gray-500"
          >
            {isLoading ? 'Buscando...' : 'Iniciar Búsqueda'}
          </button>
        )}

        {turno.estado === 'peluqueria finalizada' && (
          <button 
            onClick={() => handleUpdate('retirado entregado')} 
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-gray-500"
          >
            {isLoading ? 'Entregando...' : 'Marcar como Entregado'}
          </button>
        )}
      </div>
    </div>
  );
};


const TransporteClientView = ({ recogidas, entregas }) => {
    const [currentRecogidas, setCurrentRecogidas] = useState(recogidas);
    const [currentEntregas, setCurrentEntregas] = useState(entregas);

    const handleStatusUpdate = async (userId, mascotaId, turnoId, newStatus) => {
        const result = await updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus });
        if (result.success) {
            // Actualizar el estado local para reflejar el cambio inmediatamente
            if (['confirmado', 'buscando'].includes(newStatus)) {
                setCurrentRecogidas(prev => prev.filter(t => t.id !== turnoId));
            } else if (newStatus === 'retirado entregado') {
                setCurrentEntregas(prev => prev.filter(t => t.id !== turnoId));
            }
        } else {
            // Manejar el error, quizás con una notificación
            console.error("Fallo al actualizar el turno:", result.error);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Panel de Transporte - Hoy</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div id="recogidas">
                    <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Recogidas Pendientes</h2>
                    {currentRecogidas.length > 0 ? (
                        currentRecogidas.map(turno => (
                            <TurnoCard key={turno.id} turno={turno} onUpdateStatus={handleStatusUpdate} />
                        ))
                    ) : (
                        <p className="text-gray-400">No hay recogidas pendientes por ahora.</p>
                    )}
                </div>
                <div id="entregas">
                    <h2 className="text-2xl font-semibold mb-4 text-green-400">Entregas Pendientes</h2>
                    {currentEntregas.length > 0 ? (
                        currentEntregas.map(turno => (
                            <TurnoCard key={turno.id} turno={turno} onUpdateStatus={handleStatusUpdate} />
                        ))
                    ) : (
                        <p className="text-gray-400">No hay mascotas listas para ser entregadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// El componente principal que se renderiza en el servidor
import { getTurnsForTransporte } from '@/lib/actions/turnos.empleado.actions';

const TransportePage = async () => {
  const { data, error } = await getTurnsForTransporte();

  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-white">Cargando turnos...</div>;
  }

  return <TransporteClientView recogidas={data.recogidas} entregas={data.entregas} />;
};

export default TransportePage;
