'use client';

import { useState } from 'react';
import Paso1_SeleccionarCategoria from '@/app/components/turnos/Paso1_SeleccionarCategoria';
import Paso2_SeleccionarServicio from '@/app/components/turnos/Paso2_SeleccionarServicio';
import Paso3_DefinirHorario from '@/app/components/turnos/Paso3_DefinirHorario';

export default function NuevoTurnoPage() {
  const [pasoActual, setPasoActual] = useState(1);
  const [datosTurno, setDatosTurno] = useState({
    categoria: null,      // 'clinica' o 'peluqueria'
    servicioId: null,     // ID del servicio seleccionado
    servicioNombre: null, // Nombre del servicio
    conTraslado: false,   // Booleano para peluquería
    bloqueTurno: null,    // 'mañana' o 'tarde' para peluquería
    fecha: null,          // Fecha para clínica
    hora: null,           // Hora específica para clínica
    mascotas: [],         // Array de IDs de mascotas seleccionadas
  });

  const handleSiguientePaso = (datosPaso) => {
    setDatosTurno(prev => ({ ...prev, ...datosPaso }));
    setPasoActual(prev => prev + 1);
  };

  const handlePasoAnterior = () => {
    setPasoActual(prev => prev - 1);
  };

  const TOTAL_PASOS = 5; // Estimación inicial de pasos

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return <Paso1_SeleccionarCategoria alSiguiente={handleSiguientePaso} />;
      case 2:
        return <Paso2_SeleccionarServicio datosPrevios={datosTurno} alSiguiente={handleSiguientePaso} alAnterior={handlePasoAnterior} />;
      case 3:
        return <Paso3_DefinirHorario datosPrevios={datosTurno} alSiguiente={handleSiguientePaso} alAnterior={handlePasoAnterior} />;
      default:
        return <p className="text-center font-semibold text-blue-600 mt-4">Paso {pasoActual} en construcción...</p>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-8 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        
        {/* Encabezado y Barra de Progreso */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Solicitar un Turno</h1>
            <p className="text-gray-500 text-center mb-6">Sigue los pasos para encontrar el turno perfecto para tu mascota.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(pasoActual / TOTAL_PASOS) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Contenido dinámico del paso */}
        <div className="mt-6">
          {renderPasoActual()}
        </div>

      </div>
    </div>
  );
}
