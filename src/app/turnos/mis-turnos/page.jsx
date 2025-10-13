'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import AccionesTurnoUsuario from '@/app/components/AccionesTurnoUsuario';
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiSun, FiMoon, FiScissors } from 'react-icons/fi';

function EstadoBadge({ estado }) {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center shadow-sm";
    const styles = {
        pendiente: { icon: <FiClock className="mr-2" />, classes: "bg-yellow-100 text-yellow-800" },
        confirmado: { icon: <FiCheckCircle className="mr-2" />, classes: "bg-green-100 text-green-800" },
        cancelado: { icon: <FiXCircle className="mr-2" />, classes: "bg-red-100 text-red-800" },
        completado: { icon: <FiCheckCircle className="mr-2" />, classes: "bg-blue-100 text-blue-800" },
    };
    const style = styles[estado?.toLowerCase()] || styles.pendiente;

    return (
        <div className={`${baseClasses} ${style.classes}`}>
            {style.icon}
            {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Pendiente'}
        </div>
    );
}

const MisTurnosContent = () => {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchTurnos = async () => {
            try {
                const turnosRef = collection(db, 'turnos');
                const q = query(turnosRef, where('clienteId', '==', user.uid), orderBy('fecha', 'desc'));
                const turnosSnap = await getDocs(q);
                
                const turnosData = await Promise.all(turnosSnap.docs.map(async (d) => {
                    const turno = { id: d.id, ...d.data() };
                    let mascotaNombre = 'Mascota desconocida';
                    if (turno.mascotaId) {
                        const mascotaRef = doc(db, 'users', user.uid, 'mascotas', turno.mascotaId);
                        const mascotaSnap = await getDoc(mascotaRef);
                        if (mascotaSnap.exists()) {
                            mascotaNombre = mascotaSnap.data().nombre;
                        }
                    }
                    return {
                        ...turno,
                        mascotaNombre,
                        fechaFormateada: new Date(turno.fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                    };
                }));

                setTurnos(turnosData);
            } catch (error) {
                console.error("Error al obtener los turnos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                 <div className="loader"></div>
                 <style jsx>{`
                    .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                     <div className="flex items-center mb-8">
                        <Link href="/" legacyBehavior>
                            <a className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                <span className="ml-1 font-medium">Volver</span>
                            </a>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Mis Turnos</h1>
                        <div className="w-full ml-6 border-b-2 border-dotted border-gray-300"></div>
                    </div>

                    {turnos.length === 0 ? (
                        <div className="text-center py-12">
                            <FiCalendar className="mx-auto text-6xl text-violet-300 mb-4"/>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sin Turnos Solicitados</h2>
                            <p className="text-gray-500 mb-6">Parece que tus mascotas aún no tienen citas. ¡Vamos a solucionarlo!</p>
                            <Link href="/" className="mt-6 inline-block bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105">
                                Pedir un Turno
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {turnos.map(turno => (
                                <div key={turno.id} className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 transition-opacity duration-500 ${turno.estado === 'cancelado' ? 'opacity-60' : ''}`}>
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <div className="flex-grow mb-4 sm:mb-0">
                                            <div className="flex items-center mb-3">
                                                <h2 className="text-2xl font-bold text-gray-900 mr-4">{turno.mascotaNombre}</h2>
                                                <EstadoBadge estado={turno.estado} />
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-2 pl-1">
                                                <p className="flex items-center"><FiCalendar className="mr-3 text-violet-500" /> {turno.fechaFormateada}</p>
                                                <p className="flex items-center capitalize"><FiSun className="mr-3 text-yellow-500"/> Turno {turno.turno}</p>
                                                {turno.servicios && <p className="flex items-center capitalize"><FiScissors className="mr-3 text-gray-500"/> Servicios: {turno.servicios.join(', ')}</p>}
                                            </div>
                                        </div>
                                        <AccionesTurnoUsuario turno={turno} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MisTurnosPage() {
    return (
            <MisTurnosContent />
    );
}
