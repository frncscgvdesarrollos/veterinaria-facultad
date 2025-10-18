'use client';

import { useState } from 'react';
import { FaArrowLeft, FaSun, FaMoon, FaShuttleVan } from 'react-icons/fa';

// Placeholder para el componente de calendario que usaremos para la clínica
const CalendarPlaceholder = () => (
    <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">Próximamente: Calendario de turnos para la clínica.</p>
    </div>
);


export default function Paso3_DefinirHorario({ datosPrevios, alSiguiente, alAnterior }) {
    const esPeluqueria = datosPrevios.categoria === 'peluqueria';

    // Estado para peluquería
    const [bloqueTurno, setBloqueTurno] = useState(null); // 'mañana' | 'tarde'
    const [conTraslado, setConTraslado] = useState(false);

    // Estado para clínica (lo desarrollaremos luego)
    const [fecha, setFecha] = useState(null);
    const [hora, setHora] = useState(null);

    const handleConfirmar = () => {
        if (esPeluqueria) {
            if(bloqueTurno) {
                alSiguiente({ bloqueTurno, conTraslado });
            }
        } else {
            // Lógica para clínica
            if(fecha && hora) {
                alSiguiente({ fecha, hora });
            }
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={alAnterior} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-700 ml-4">Configura los detalles del turno</h2>
            </div>

            {esPeluqueria ? (
                // UI para PELUQUERÍA
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">Elige el bloque horario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => setBloqueTurno('mañana')} className={`flex items-center justify-center p-6 border rounded-lg transition-all ${bloqueTurno === 'mañana' ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                <FaSun className="text-yellow-500 mr-3" />
                                <span className="font-semibold">Turno Mañana</span>
                            </button>
                            <button onClick={() => setBloqueTurno('tarde')} className={`flex items-center justify-center p-6 border rounded-lg transition-all ${bloqueTurno === 'tarde' ? 'bg-indigo-100 border-indigo-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                <FaMoon className="text-indigo-500 mr-3" />
                                <span className="font-semibold">Turno Tarde</span>
                            </button>
                        </div>
                    </div>
                    <div>
                         <h3 className="font-semibold text-lg text-gray-800 mb-3">¿Necesitas traslado?</h3>
                         <button onClick={() => setConTraslado(!conTraslado)} className={`w-full flex items-center p-4 border rounded-lg transition-all ${conTraslado ? 'bg-green-100 border-green-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <FaShuttleVan className={`mr-4 text-2xl ${conTraslado ? 'text-green-600' : 'text-gray-500'}`} />
                            <span className="flex-grow text-left font-semibold">Servicio de traslado a domicilio</span>
                            <div className={`w-14 h-8 rounded-full flex items-center transition-colors p-1 ${conTraslado ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${conTraslado ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            ) : (
                // UI para CLÍNICA (Placeholder por ahora)
                <CalendarPlaceholder />
            )}

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleConfirmar}
                    disabled={(esPeluqueria && !bloqueTurno) || (!esPeluqueria && !hora)}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
