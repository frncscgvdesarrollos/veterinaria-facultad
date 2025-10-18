import { FaStethoscope, FaCut } from 'react-icons/fa';

export default function Paso1_SeleccionarCategoria({ alSiguiente }) {

  const handleSeleccion = (categoria) => {
    alSiguiente({ categoria });
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">¿Qué tipo de servicio necesitas?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
        
        {/* Opción Clínica */}
        <button
          onClick={() => handleSeleccion('clinica')}
          className="group flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <FaStethoscope className="text-5xl text-blue-500 group-hover:text-blue-600 mb-4 transition-colors" />
          <span className="text-xl font-semibold text-blue-800">Clínica Veterinaria</span>
          <p className="text-sm text-gray-500 mt-1">Consultas, revisiones y seguimiento.</p>
        </button>

        {/* Opción Peluquería */}
        <button
          onClick={() => handleSeleccion('peluqueria')}
          className="group flex flex-col items-center justify-center p-8 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <FaCut className="text-5xl text-green-500 group-hover:text-green-600 mb-4 transition-colors" />
          <span className="text-xl font-semibold text-green-800">Peluquería Canina</span>
          <p className="text-sm text-gray-500 mt-1">Baños, cortes y estética.</p>
        </button>

      </div>
    </div>
  );
}
