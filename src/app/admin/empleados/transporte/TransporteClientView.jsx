'use client';

import { useState, useMemo } from 'react';
import { updateTurnoStatusByEmpleado } from '@/lib/actions/turnos.empleado.actions';

// --- Componente para el Botón de Acción Dinámico ---
const ActionButton = ({ turno, onUpdate, isLoading }) => {
    const { estado, userId, mascotaId, id } = turno;

    const actions = {
        confirmado: { text: 'Iniciar Búsqueda', newStatus: 'buscando', className: 'bg-indigo-600 hover:bg-indigo-700' },
        buscando: { text: 'Marcar Recogido', newStatus: 'buscado', className: 'bg-blue-600 hover:bg-blue-700' },
        buscado: { text: 'Entregado en Veterinaria', newStatus: 'veterinaria', className: 'bg-cyan-600 hover:bg-cyan-700' },
        'peluqueria finalizada': { text: 'Retirar de Peluquería', newStatus: 'devolviendo', className: 'bg-purple-600 hover:bg-purple-700' },
        devolviendo: { text: 'Mascota Entregada', newStatus: 'servicio terminado', className: 'bg-green-600 hover:bg-green-700' },
    };

    const action = actions[estado];

    if (!action) {
        return (
            <span className="text-sm text-gray-500 italic">En progreso...</span>
        );
    }

    return (
        <button
            onClick={() => onUpdate(userId, mascotaId, id, action.newStatus)}
            disabled={isLoading}
            className={`text-white font-bold py-2 px-4 rounded transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed ${action.className}`}
        >
            {isLoading ? '...' : action.text}
        </button>
    );
};

// --- Componente Principal de la Vista del Cliente de Transporte ---
const TransporteClientView = ({ recogidas, entregas }) => {
    // 1. Fusionamos las props en un único estado
    const initialState = useMemo(() => [...(recogidas || []), ...(entregas || [])].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)), [recogidas, entregas]);
    const [turnos, setTurnos] = useState(initialState);
    const [loadingTurnoId, setLoadingTurnoId] = useState(null);

    // 2. La función de actualización ahora modifica el estado en lugar de filtrar
    const handleStatusUpdate = async (userId, mascotaId, turnoId, newStatus) => {
        setLoadingTurnoId(turnoId);
        const result = await updateTurnoStatusByEmpleado({ userId, mascotaId, turnoId, newStatus });
        
        if (result.success) {
            setTurnos(prevTurnos =>
                prevTurnos.map(t =>
                    t.id === turnoId ? { ...t, estado: newStatus } : t
                )
            );
        } else {
            console.error("Fallo al actualizar el turno:", result.error);
            // Opcional: mostrar un toast/alerta de error al usuario
        }
        setLoadingTurnoId(null);
    };
    
    // Diccionario para dar estilo a las etiquetas de estado
    const statusColors = {
      default: 'bg-gray-100 text-gray-800',
      confirmado: 'bg-yellow-100 text-yellow-800',
      buscando: 'bg-blue-100 text-blue-800',
      buscado: 'bg-cyan-100 text-cyan-800',
      veterinaria: 'bg-indigo-100 text-indigo-800',
      'peluqueria iniciada': 'bg-pink-100 text-pink-800',
      'peluqueria finalizada': 'bg-purple-100 text-purple-800',
      devolviendo: 'bg-orange-100 text-orange-800',
      'servicio terminado': 'bg-green-100 text-green-800',
    };

    return (
        <div className="p-4 md:p-8 bg-white text-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Transporte</h1>
            <p className="text-gray-600 mb-8">Gestiona los turnos con traslado para el día de hoy.</p>

            {turnos.length === 0 ? (
                <p className="text-gray-500 text-center mt-12">No hay turnos con transporte para hoy.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dueño</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Actual</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {turnos.map((turno) => (
                                <tr key={turno.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(turno.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turno.mascota.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.user.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.user.direccion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[turno.estado] || statusColors.default}`}>
                                          {turno.estado}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <ActionButton
                                            turno={turno}
                                            onUpdate={handleStatusUpdate}
                                            isLoading={loadingTurnoId === turno.id}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransporteClientView;
