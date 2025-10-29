'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getTurnsForAdminDashboard, updateTurnoStatus } from "@/lib/actions/turnos.admin.actions.js";
import TurnosTable from './TurnosTable';
import FilterInput from './FilterInput';

const IconoClinica = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconoPeluqueria = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121a3 3 0 10-4.242 0M12 18.5V19m0-16v.5m-5.071 2.929l.354.354M17.425 5.575l-.354.354M4 12H3.5m17 0h-.5" /></svg>;

function TurnoCard({ turno, onUpdate, isUpdating, currentView }) {
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
  const cardBorder = { clinica: 'border-blue-500', peluqueria: 'border-pink-500' };

  const handleAction = (newStatus) => {
    onUpdate(turno.userId, turno.mascotaId, turno.id, newStatus);
  };

  const formattedDate = () => {
    const date = new Date(turno.fecha);
    if (currentView === 'hoy') return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + 'hs';
    return date.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + 'hs';
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 mb-4 border-l-4 ${cardBorder[turno.tipo] || 'border-gray-300'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-lg text-gray-800">{turno.mascota.nombre}</p>
          <p className="text-sm text-gray-600">Dueño: {turno.user.nombre} {turno.user.apellido}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[turno.estado] || 'bg-gray-200 text-gray-800'}`}>{turno.estado}</span>
      </div>
      <p className="text-gray-700 mb-3"><span className="font-semibold">Servicio:</span> {turno.servicioNombre}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formattedDate()}</span>
        <div className="flex gap-2">
          {isUpdating && <span className="text-sm text-gray-500">Actualizando...</span>}
          {!isUpdating && (
            <>
              {currentView === 'proximos' && turno.estado === 'pendiente' && (<button onClick={() => handleAction('confirmado')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">Confirmar</button>)}
              {currentView === 'hoy' && turno.estado === 'confirmado' && (<button onClick={() => handleAction('finalizado')} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Finalizar</button>)}
              {currentView !== 'finalizados' && turno.estado !== 'cancelado' && (<button onClick={() => handleAction('cancelado')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Cancelar</button>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminTurnosDashboard() {
  const [turnos, setTurnos] = useState({ hoy: [], proximos: [], finalizados: [], reprogramar: [], mensual: [] });
  const [vistaActual, setVistaActual] = useState('hoy');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, startTransition] = useTransition();

  const cargarTurnos = async () => {
    setError(null);
    setLoading(true);
    try {
      const resultado = await getTurnsForAdminDashboard();
      if (resultado.success) setTurnos(resultado.data);
      else setError(resultado.error || "Ocurrió un error desconocido.");
    } catch (err) {
      setError("No se pudo establecer conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const handleUpdateStatus = (userId, mascotaId, turnoId, newStatus) => {
    startTransition(async () => {
      const result = await updateTurnoStatus({ userId, mascotaId, turnoId, newStatus });
      if (result.success) await cargarTurnos();
      else setError(result.error);
    });
  };

  const filteredTurnos = (turnos[vistaActual] || []).filter(turno => {
    const term = searchTerm.toLowerCase();
    return (
      turno.mascota.nombre.toLowerCase().includes(term) ||
      `${turno.user.nombre.toLowerCase()} ${turno.user.apellido.toLowerCase()}`.includes(term) ||
      turno.servicioNombre.toLowerCase().includes(term) ||
      turno.estado.toLowerCase().includes(term)
    );
  });

  const turnosClinica = filteredTurnos.filter(t => t.tipo === 'clinica');
  const turnosPeluqueria = filteredTurnos.filter(t => t.tipo === 'peluqueria');

  if (loading && !isUpdating) return <div className="text-center p-10 font-semibold text-lg text-gray-600">Cargando turnos...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg shadow-md"><strong>Error:</strong> {error}</div>;

  const getTabStyle = (tabName) => `px-6 py-3 font-semibold rounded-t-lg focus:outline-none transition-colors ${vistaActual === tabName ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`;
  const getReprogramarTabStyle = () => {
    const baseStyle = 'px-6 py-3 font-semibold rounded-t-lg focus:outline-none transition-colors ';
    const isActive = vistaActual === 'reprogramar';
    const hasItems = turnos.reprogramar && turnos.reprogramar.length > 0;
    if (isActive) return baseStyle + 'bg-orange-500 text-white';
    if (hasItems) return baseStyle + 'bg-orange-200 text-orange-800 hover:bg-orange-300 animate-pulse';
    return baseStyle + 'bg-gray-200 text-gray-600 hover:bg-gray-300';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <Link href="/admin">
          <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
            <FaArrowLeft className="mr-2" />
            Volver al Panel Principal
          </span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración de Turnos</h1>

      <div className="flex border-b-2 border-blue-600 mb-6 flex-wrap">
        <button className={getTabStyle('hoy')} onClick={() => setVistaActual('hoy')}>Turnos del Día</button>
        <button className={getTabStyle('proximos')} onClick={() => setVistaActual('proximos')}>Próximos a Confirmar</button>
        <button className={getTabStyle('mensual')} onClick={() => setVistaActual('mensual')}>Turnos del Mes</button>
        <button className={getReprogramarTabStyle()} onClick={() => setVistaActual('reprogramar')}>Para Reprogramar ({turnos.reprogramar?.length || 0})</button>
        <button className={getTabStyle('finalizados')} onClick={() => setVistaActual('finalizados')}>Historial</button>
      </div>

      <FilterInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por mascota, dueño, servicio..." />

      {isUpdating && <div className='text-center mb-4 text-blue-600 font-semibold'>Actualizando...</div>}

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Columna Clínica */}
        <div className="bg-gray-50 p-4 rounded-lg flex-1">
          <div className="flex items-center mb-4">
            <IconoClinica />
            <h2 className="text-xl font-bold text-gray-700">Turnos de Clínica ({turnosClinica.length})</h2>
          </div>

          {/* Vista Escritorio (Tabla) */}
          <div className="md:block ">
            <TurnosTable turnos={turnosClinica} onUpdate={handleUpdateStatus} isUpdating={isUpdating} currentView={vistaActual} />
          </div>

          {/* Vista Móvil (Tarjetas) */}
          <div className="md:hidden">
            {turnosClinica.map(turno => (
              <TurnoCard key={turno.id} turno={turno} onUpdate={handleUpdateStatus} isUpdating={isUpdating} currentView={vistaActual} />
            ))}
            {!turnosClinica.length && (
              <p className="text-center text-gray-500 mt-4">No hay turnos para mostrar.</p>
            )}
          </div>
        </div>

        {/* Columna Peluquería */}
        <div className="bg-gray-50 p-4 rounded-lg flex-1">
          <div className="flex items-center mb-4">
            <IconoPeluqueria />
            <h2 className="text-xl font-bold text-gray-700">Turnos de Peluquería ({turnosPeluqueria.length})</h2>
          </div>

          {/* Vista Escritorio (Tabla) */}
          <div className="md:block">
            <TurnosTable turnos={turnosPeluqueria} onUpdate={handleUpdateStatus} isUpdating={isUpdating} currentView={vistaActual} />
          </div>

          {/* Vista Móvil (Tarjetas) */}
          <div className="md:hidden">
            {turnosPeluqueria.map(turno => (
              <TurnoCard key={turno.id} turno={turno} onUpdate={handleUpdateStatus} isUpdating={isUpdating} currentView={vistaActual} />
            ))}
            {!turnosPeluqueria.length && (
              <p className="text-center text-gray-500 mt-4">No hay turnos para mostrar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
