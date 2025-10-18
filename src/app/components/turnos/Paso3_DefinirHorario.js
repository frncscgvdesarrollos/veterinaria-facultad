'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaSun, FaMoon, FaShuttleVan } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { getHorariosDisponibles } from '@/app/turnos/nuevo/actions';

export default function Paso3_DefinirHorario({ datosPrevios, alSiguiente, alAnterior }) {
    const esPeluqueria = datosPrevios.categoria === 'peluqueria';

    // Estado para Peluquería
    const [bloqueTurno, setBloqueTurno] = useState(datosPrevios.bloqueTurno || null);
    const [conTraslado, setConTraslado] = useState(datosPrevios.conTraslado || false);

    // Estado para Clínica
    const [fecha, setFecha] = useState(datosPrevios.fecha ? new Date(datosPrevios.fecha) : undefined);
    const [hora, setHora] = useState(datosPrevios.hora || null);
    const [horarios, setHorarios] = useState([]);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);

    useEffect(() => {
        if (fecha && !esPeluqueria) {
            const cargarHorarios = async () => {
                setCargandoHorarios(true);
                const resultado = await getHorariosDisponibles(fecha);
                setHorarios(resultado.horarios || []);
                setCargandoHorarios(false);
            };
            cargarHorarios();
            // Reseteamos la hora seleccionada si la fecha cambia
            setHora(null);
        }
    }, [fecha, esPeluqueria]);

    const handleConfirmar = () => {
        if (esPeluqueria) {
            if (bloqueTurno) {
                alSiguiente({ bloqueTurno, conTraslado });
            }
        } else {
            if (fecha && hora) {
                // Guardamos la fecha como un string ISO para consistencia
                alSiguiente({ fecha: fecha.toISOString(), hora });
            }
        }
    };
    
    const footer = fecha
    ? <p className='text-center font-bold text-blue-600 p-2'>Has seleccionado el {format(fecha, "PPP", { locale: es })}.</p>
    : <p className='text-center p-2'>Por favor, selecciona un día.</p>;

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
                    {/* ... (código de peluquería sin cambios) ... */}
                </div>
            ) : (
                // UI para CLÍNICA
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='flex justify-center'>
                         <DayPicker
                            mode="single"
                            selected={fecha}
                            onSelect={setFecha}
                            locale={es}
                            footer={footer}
                            fromDate={new Date()} // No se pueden seleccionar días pasados
                            className="border rounded-lg p-4 bg-white shadow-sm"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-4">Horarios disponibles</h3>
                        {cargandoHorarios && <p>Cargando horarios...</p>}
                        {!cargandoHorarios && fecha && horarios.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {horarios.map(h => (
                                    <button 
                                        key={h}
                                        onClick={() => setHora(h)}
                                        className={`p-2 border rounded-lg font-semibold transition-colors ${
                                            hora === h ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                        }`}>
                                        {h}
                                    </button>
                                ))}
                            </div>
                        )}
                         {!cargandoHorarios && fecha && horarios.length === 0 && (
                            <p className='text-gray-500'>No hay horarios disponibles para este día.</p>
                        )}
                        {!fecha && <p className='text-gray-500'>Selecciona una fecha para ver los horarios.</p>}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button onClick={alAnterior} className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Volver</button>
                <button
                    onClick={handleConfirmar}
                    disabled={(esPeluqueria && !bloqueTurno) || (!esPeluqueria && (!fecha || !hora))}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
