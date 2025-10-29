'use client';

import { useState } from 'react';
import { getTurnsForPeluqueria, updateTurnoStatusByEmpleado } from '@/lib/actions/turnos.empleado.actions';

const TurnoPeluqueriaCard = ({ turno, onUpdateStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newStatus) => {
    setIsLoading(true);
    try {
      await onUpdateStatus(turno.clienteId, turno.mascotaId, turno.id, newStatus);
    } catch (error) {
      console.error("Error al finalizar la peluquería:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enVeterinaria': return 'text-green-400';
      case 'buscando':
      case 'buscado': return 'text-blue-400';
      case 'confirmado': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold text-white">{turno.mascota.nombre}</h3>
        <p className="text-sm text-gray-400">Dueño: {turno.user.nombre} {turno.user.apellido}</p>
        <p className={`text-sm font-semibold ${getStatusColor(turno.estado)}`}>
          Estado: {turno.estado}
        </p>
        {turno.necesitaTraslado && <p className="text-xs text-cyan-400">(Con Traslado)</p>}
      </div>
      <div>
        {turno.estado === 'enVeterinaria' && (
          <button 
            onClick={() => handleUpdate('peluqueria finalizada')} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-gray-500"
          >
            {isLoading ? 'Finalizando...' : 'Finalizar Peluquería'}
          </button>
        )}
      </div>
    </div>
  );
};

const PeluqueriaClientView = ({ initialTurnos }) => {
    const [turnos, setTurnos] = useState(initialTurnos);

    const handleStatusUpdate = async (userId, mascotaId, turnoId, newStatus) => {
        const result = await updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus });
        if (result.success) {
            setTurnos(prev => prev.filter(t => t.id !== turnoId));
        } else {
            console.error("Fallo al actualizar el turno:", result.error);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Panel de Peluquería - Hoy</h1>
            <div id="turnos-peluqueria">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Turnos Pendientes</h2>
                {turnos.length > 0 ? (
                    turnos.map(turno => (
                        <TurnoPeluqueriaCard key={turno.id} turno={turno} onUpdateStatus={handleStatusUpdate} />
                    ))
                ) : (
                    <p className="text-gray-400">No hay turnos de peluquería pendientes por ahora.</p>
                )}
            </div>
        </div>
    );
};


// Componente principal que se renderiza en el servidor
const PeluqueriaPage = async () => {
  const { data, error } = await getTurnsForPeluqueria();

  if (error) {
    return <div className="p-8 text-red-500">Error al cargar los turnos: {error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-white">Cargando turnos...</div>;
  }

  return <PeluqueriaClientView initialTurnos={data} />;
};

export default PeluqueriaPage;
