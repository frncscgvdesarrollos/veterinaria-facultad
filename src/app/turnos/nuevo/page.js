'use client';

import { useState } from 'react';
import Paso1_SeleccionarCategoria from '@/app/components/turnos/Paso1_SeleccionarCategoria';
import Paso2_SeleccionarServicio from '@/app/components/turnos/Paso2_SeleccionarServicio';
import Paso3_DefinirHorario from '@/app/components/turnos/Paso3_DefinirHorario';
import Paso4_SeleccionarMascota from '@/app/components/turnos/Paso4_SeleccionarMascota';
import Paso5_ResumenYConfirmar from '@/app/components/turnos/Paso5_ResumenYConfirmar';

export default function NuevoTurnoPage() {
  const [pasoActual, setPasoActual] = useState(1);
  const [datosTurno, setDatosTurno] = useState({
    categoria: null,
    servicioId: null,
    servicioNombre: null,
    conTraslado: false,
    bloqueTurno: null,
    fecha: null,
    hora: null,
    mascotas: [],
  });

  const handleSiguientePaso = (datosPaso) => {
    setDatosTurno(prev => ({ ...prev, ...datosPaso }));
    setPasoActual(prev => prev + 1);
  };

  const handlePasoAnterior = () => {
    setPasoActual(prev => prev - 1);
  };

  const TOTAL_PASOS = 5;

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return <Paso1_SeleccionarCategoria alSiguiente={handleSiguientePaso} />;
      case 2:
        return <Paso2_SeleccionarServicio datosPrevios={datosTurno} alSiguiente={handleSiguientePaso} alAnterior={handlePasoAnterior} />;
      case 3:
        return <Paso3_DefinirHorario datosPrevios={datosTurno} alSiguiente={handleSiguientePaso} alAnterior={handlePasoAnterior} />;
      case 4:
        return <Paso4_SeleccionarMascota datosPrevios={datosTurno} alSiguiente={handleSiguientePaso} alAnterior={handlePasoAnterior} />;
      case 5:
        return <Paso5_ResumenYConfirmar datosPrevios={datosTurno} alAnterior={handlePasoAnterior} />;
      default:
        return <p>Error: Paso desconocido.</p>; // Manejo de un caso inesperado
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-8 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        
        <div className="mb-8">
            {/* No mostrar la barra de progreso en la pantalla de éxito */}
            {pasoActual <= TOTAL_PASOS && (
              <>
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Solicitar un Turno</h1>
                <p className="text-gray-500 text-center mb-6">Paso {pasoActual} de {TOTAL_PASOS}: Sigue las instrucciones.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(pasoActual / TOTAL_PASOS) * 100}%` }}
                    ></div>
                </div>
              </>
            )}
        </div>

        <div className="mt-6">
          {renderPasoActual()}
        </div>

      </div>
    </div>
  );
}
