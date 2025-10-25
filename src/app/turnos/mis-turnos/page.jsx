'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FaDog, FaCat, FaPlus, FaCalendarCheck, FaHistory, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

// --- Firebase Imports ---
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// --- Actions ---
import { getTurnosByUserId } from '@/lib/actions/turnos.user.actions.js';


const TurnoCard = ({ turno }) => {
    const statusStyles = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        confirmado: 'bg-blue-100 text-blue-800',
        finalizado: 'bg-green-100 text-green-800',
        cancelado: 'bg-red-100 text-red-800',
        reprogramar: 'bg-orange-100 text-orange-800',
    };

    const formattedDate = turno.fecha
        ? new Date(turno.fecha).toLocaleString('es-AR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' hs'
        : 'Fecha no especificada';

    const necesitaReprogramacion = turno.estado === 'reprogramar';
    
    // El color del ícono depende del tipo de servicio
    const iconColor = turno.tipo === 'peluqueria' ? 'text-pink-500' : 'text-blue-500';
    // El nombre de la mascota ahora viene del objeto completo
    const mascotaNombre = turno.mascota?.nombre || 'Mascota no encontrada';

    return (
        <div className={`bg-white shadow-md rounded-lg p-5 border-l-4 ${necesitaReprogramacion ? 'border-orange-500' : 'border-gray-200 hover:border-blue-500'} transition-all duration-300`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center min-w-0"> {/* Evita que el texto se desborde */}
                    <div className="w-8 flex-shrink-0 mr-4">
                        {/* ESTA ES LA CORRECCIÓN FINAL: Ahora sí tiene la especie */}
                        {turno.mascota?.especie?.toLowerCase() === 'perro' 
                            ? <FaDog className={iconColor} size={24} />
                            : <FaCat className={iconColor} size={24} />
                        }
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{turno.servicioNombre}</h3>
                        <p className="text-md text-gray-600 font-semibold">Para: {mascotaNombre}</p>
                    </div>
                </div>
                <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full flex items-center flex-shrink-0 ${statusStyles[turno.estado] || 'bg-gray-100'}`}>
                    {necesitaReprogramacion && <FaExclamationTriangle className="mr-1.5" />}
                    {turno.estado}
                </span>
            </div>
            
            {!necesitaReprogramacion && (
                <div className="text-right text-sm text-gray-500">
                    <p>{formattedDate}</p>
                </div>
            )}

            {necesitaReprogramacion && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-orange-700 mb-3">Este turno necesita ser reprogramado.</p>
                    <Link
                        href={`/turnos/reprogramar?turnoId=${turno.id}&userId=${turno.userId}&mascotaId=${turno.mascotaId}`}
                        className="inline-flex items-center justify-center bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 shadow-lg"
                    >
                        Elegir nueva fecha
                        <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            )}
        </div>
    );
};


export default function MisTurnosPage() {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState({ proximos: [], historial: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchTurnosAndMascotas = async () => {
                setLoading(true);
                setError(null);
                try {
                    // 1. Cargar turnos y mascotas al mismo tiempo
                    const [turnosResult, mascotasSnap] = await Promise.all([
                        getTurnosByUserId({ userId: user.uid }),
                        getDocs(query(collection(db, 'users', user.uid, 'mascotas')))
                    ]);

                    // 2. Crear un mapa de mascotas para encontrarlas fácilmente (id -> data)
                    const mascotasMap = {};
                    mascotasSnap.forEach(doc => {
                        mascotasMap[doc.id] = { id: doc.id, ...doc.data() };
                    });

                    if (turnosResult.success) {
                        // 3. Función para "enriquecer" cada turno con los datos completos de la mascota
                        const enrichTurnos = (turnosList) => {
                            if (!Array.isArray(turnosList)) return [];
                            return turnosList.map(turno => ({
                                ...turno,
                                // Reemplazamos el objeto parcial de mascota con el objeto completo
                                mascota: mascotasMap[turno.mascotaId] || { nombre: 'Desconocida', especie: 'gato' }
                            }));
                        };

                        // 4. Actualizar el estado con los turnos ya enriquecidos
                        setTurnos({
                            proximos: enrichTurnos(turnosResult.data.proximos),
                            historial: enrichTurnos(turnosResult.data.historial),
                        });
                    } else {
                        setError(turnosResult.error);
                    }
                } catch (err) {
                    console.error("Error al cargar datos:", err);
                    setError('No se pudo establecer conexión con el servidor.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTurnosAndMascotas();
        } else if (user === null) {
            setLoading(false); // No hay usuario, no hay nada que cargar
        }
    }, [user]);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center text-gray-500 py-10">Cargando tus turnos...</div>;
        }

        if (error) {
            return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">Error: {error}</div>;
        }

        if (!user) {
            return (
                <div className="text-center text-gray-600 py-10">
                    <p className="mb-4">Necesitas iniciar sesión para ver tus turnos.</p>
                    <Link href="/login" className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                        Iniciar Sesión
                    </Link>
                </div>
            );
        }

        const noHayTurnos = turnos.proximos.length === 0 && turnos.historial.length === 0;

        if (noHayTurnos) {
            return (
                 <div className="text-center text-gray-500 mt-10 p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Aún no tienes turnos registrados</h2>
                    <p className="mb-6">¡Es un buen momento para cuidar a tu mascota!</p>
                    <Link href="/turnos/nuevo" className="flex items-center justify-center w-max mx-auto bg-green-500 text-white py-2 px-5 rounded-lg hover:bg-green-600 transition shadow-lg">
                        <FaPlus className="mr-2" />
                        Solicitar un Nuevo Turno
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-12">
                <section>
                    <h2 className="flex items-center text-2xl font-bold text-gray-700 mb-4"><FaCalendarCheck className="mr-3 text-blue-500"/>Próximos Turnos</h2>
                    {turnos.proximos.length > 0 ? (
                        <div className="space-y-4">
                            {turnos.proximos.map(turno => <TurnoCard key={turno.id} turno={turno} />)}
                        </div>
                    ) : (<p className="text-gray-500 italic">No tienes turnos próximos.</p>)}
                </section>
                <section>
                     <h2 className="flex items-center text-2xl font-bold text-gray-700 mb-4"><FaHistory className="mr-3 text-gray-500"/>Historial</h2>
                    {turnos.historial.length > 0 ? (
                        <div className="space-y-4">
                            {turnos.historial.map(turno => <TurnoCard key={turno.id} turno={turno} />)}
                        </div>
                    ) : (<p className="text-gray-500 italic">No hay turnos en tu historial.</p>)}
                </section>
            </div>
        );
    };

    return (
        <main className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mis Turnos</h1>
                {user && <Link href="/turnos/nuevo" className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition shadow-md">
                    <FaPlus className="mr-2" />
                    Nuevo Turno
                </Link>}
            </div>
            {renderContent()}
        </main>
    );
}
