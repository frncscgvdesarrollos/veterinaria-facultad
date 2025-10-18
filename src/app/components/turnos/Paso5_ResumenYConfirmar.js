'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/firebase/AuthProvider';
import { getMascotasDelUsuario } from '@/app/actions/mascotasActions';
import { registrarTurno } from '@/app/turnos/nuevo/actions';
import { FaCalendarAlt, FaClock, FaDog, FaCut, FaCheckCircle, FaExclamationCircle, FaSpinner, FaSun, FaMoon, FaShuttleVan } from 'react-icons/fa';

export default function Paso5_ResumenYConfirmar({ datosPrevios, alAnterior }) {
    const { user } = useAuth();
    const router = useRouter();

    const [mascotasInfo, setMascotasInfo] = useState([]);
    const [cargandoMascotas, setCargandoMascotas] = useState(true);
    const [estado, setEstado] = useState('idle'); // idle, submitting, success, error
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (user && datosPrevios.mascotas.length > 0) {
            const fetchMascotasInfo = async () => {
                setCargandoMascotas(true);
                const resultado = await getMascotasDelUsuario(user);
                if (resultado.success) {
                    const infoFiltrada = resultado.mascotas.filter(m => datosPrevios.mascotas.includes(m.id));
                    setMascotasInfo(infoFiltrada);
                }
                setCargandoMascotas(false);
            };
            fetchMascotasInfo();
        }
    }, [user, datosPrevios.mascotas]);

    const handleConfirmar = async () => {
        setEstado('submitting');
        const resultado = await registrarTurno(user, datosPrevios);
        if (resultado.success) {
            setEstado('success');
            setMensaje(resultado.message);
            setTimeout(() => router.push('/mis-turnos'), 3000);
        } else {
            setEstado('error');
            setMensaje(resultado.error || 'Ocurrió un error inesperado.');
        }
    };

    if (estado === 'success') {
        return (
            <div className="text-center py-12">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">¡Turno Confirmado!</h2>
                <p className="text-gray-600 mt-2">{mensaje}</p>
                <p className="text-sm text-gray-500 mt-2">Serás redirigido a &quot;Mis Turnos&quot; en breve...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Resumen del Turno</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Mascotas */}
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center"><FaDog className="mr-3 text-blue-500"/>Mascota(s)</h3>
                    {cargandoMascotas ? <p>Cargando...</p> : (
                         <div className="flex flex-wrap gap-4 mt-2">
                            {mascotasInfo.map(m => (
                                <div key={m.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border">
                                    <Image src={m.fotoUrl || 'https://via.placeholder.com/100'} alt={m.nombre} width={40} height={40} className="rounded-full object-cover"/>
                                    <span className='font-medium'>{m.nombre}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Servicio */}
                 <div>
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center"><FaCut className="mr-3 text-blue-500"/>Servicio</h3>
                    <p className="text-gray-600 mt-1 ml-1">{datosPrevios.servicioNombre}</p>
                </div>

                {/* Fecha y Hora / Bloque */}
                {datosPrevios.categoria === 'clinica' ? (
                     <div>
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center"><FaCalendarAlt className="mr-3 text-blue-500"/>Fecha y Hora</h3>
                        <p className="text-gray-600 mt-1 ml-1">{new Date(datosPrevios.fecha).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {datosPrevios.hora}</p>
                    </div>
                ) : (
                     <div>
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center"><FaClock className="mr-3 text-blue-500"/>Disponibilidad</h3>
                        <div className="flex items-center gap-4 mt-1 ml-1">
                             <p className="text-gray-600 capitalize flex items-center">{datosPrevios.bloqueTurno === 'mañana' ? <FaSun className='mr-2 text-yellow-500'/> : <FaMoon className='mr-2 text-indigo-500'/>} {datosPrevios.bloqueTurno}</p>
                            {datosPrevios.conTraslado && <p className="flex items-center text-green-600 font-medium"><FaShuttleVan className='mr-2'/>Con Traslado</p>}
                        </div>
                    </div>
                )}
            </div>

            {estado === 'error' && (
                <div className="mt-4 text-center p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
                    <FaExclamationCircle className="mr-2"/> {mensaje}
                </div>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button onClick={alAnterior} disabled={estado === 'submitting'} className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50">
                    Volver
                </button>
                <button
                    onClick={handleConfirmar}
                    disabled={cargandoMascotas || estado === 'submitting'}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center">
                    {estado === 'submitting' ? <FaSpinner className="animate-spin mr-2"/> : <FaCheckCircle className="mr-2"/>}
                    Confirmar Turno
                </button>
            </div>
        </div>
    );
}
