'use client';

import { useState, useEffect } from 'react';
import { getServiciosPorCategoria } from '../nuevo/actions';
import { FaArrowLeft } from 'react-icons/fa';

export default function Paso2_SeleccionarServicio({ datosPrevios, alSiguiente, alAnterior }) {
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datosPrevios.categoria) {
      const cargarServicios = async () => {
        setCargando(true);
        setError(null);
        const resultado = await getServiciosPorCategoria(datosPrevios.categoria);
        if (resultado.error) {
          setError(resultado.error);
          setServicios([]);
        } else {
          setServicios(resultado.servicios);
        }
        setCargando(false);
      };
      cargarServicios();
    }
  }, [datosPrevios.categoria]);

  const handleSeleccion = (servicio) => {
    setServicioSeleccionado(servicio);
  };

  const handleConfirmar = () => {
    if (servicioSeleccionado) {
      alSiguiente({ 
        servicioId: servicioSeleccionado.id,
        servicioNombre: servicioSeleccionado.nombre 
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={alAnterior} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-700 ml-4">Elige un servicio de <span className="capitalize text-blue-600">{datosPrevios.categoria}</span></h2>
      </div>

      {cargando && <p className="text-center text-gray-500">Cargando servicios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && !error && (
        <div className="space-y-3">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              onClick={() => handleSeleccion(servicio)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                servicioSeleccionado?.id === servicio.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold text-gray-800">{servicio.nombre}</p>
              <p className="text-sm text-gray-600">{servicio.descripcion}</p>
              <p className="text-right font-bold text-lg text-gray-700 mt-2">${servicio.precio}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleConfirmar}
          disabled={!servicioSeleccionado || cargando}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
