
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from '@/lib/firebaseAdmin';
import { getUserIdFromSession } from '@/lib/firebaseAdmin';
import PrivateRoute from '@/app/components/PrivateRoute';
import Footer from '@/app/components/Footer';
import AccionesTurnoUsuario from '@/app/components/AccionesTurnoUsuario';
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiSun, FiMoon, FiScissors } from 'react-icons/fi';

async function getUserTurnos(userId) {
    if (!userId) return [];
    const firestore = admin.firestore();
    try {
        // CORRECCIÓN: Se cambia 'userId' por 'clienteId' para que coincida con el campo guardado en la BD.
        const turnosSnap = await firestore.collection('turnos').where('clienteId', '==', userId).get();
        if (turnosSnap.empty) return [];

        const turnosData = turnosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Ordenar por fecha del turno descendente
        turnosData.sort((a, b) => (new Date(b.fecha)) - (new Date(a.fecha)));

        const turnosEnriquecidos = await Promise.all(turnosData.map(async (turno) => {
            let mascotaNombre = 'Mascota desconocida';
            if (turno.mascotaId) {
                // Usamos el clienteId del turno para buscar la mascota, es más seguro
                const mascotaSnap = await firestore.collection('users').doc(turno.clienteId).collection('mascotas').doc(turno.mascotaId).get();
                if (mascotaSnap.exists) {
                    mascotaNombre = mascotaSnap.data().nombre;
                }
            }
            return {
                ...turno,
                mascotaNombre,
                fechaFormateada: new Date(turno.fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            };
        }));
        return turnosEnriquecidos;
    } catch (error) {
        console.error("Error al obtener los turnos en el servidor:", error);
        return [];
    }
}

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

export default async function MisTurnosPage() {
    const sessionCookie = cookies().get('__session')?.value || '';
    const userId = await getUserIdFromSession(sessionCookie);

    if (!userId) {
        redirect('/login');
    }

    const turnos = await getUserTurnos(userId);

    return (
        <PrivateRoute>
            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Mis Turnos</h1>
                    {turnos.length === 0 ? (
                        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-100">
                            <FiCalendar className="mx-auto text-6xl text-violet-300 mb-4"/>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sin Turnos Solicitados</h2>
                            <p className="text-gray-500 mb-6">Parece que tus mascotas aún no tienen citas. ¡Vamos a solucionarlo!</p>
                            <a href="/" className="mt-6 inline-block bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105">
                                Pedir un Turno
                            </a>
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
                                                <p className="flex items-center capitalize">
                                                    {turno.turno === 'manana' ? <FiSun className="mr-3 text-yellow-500"/> : <FiMoon className="mr-3 text-blue-500"/>} 
                                                    Turno {turno.turno}
                                                </p>
                                                {turno.servicios && turno.servicios.length > 0 && (
                                                    <p className="flex items-center capitalize">
                                                        <FiScissors className="mr-3 text-gray-500"/> 
                                                        Servicios: {turno.servicios.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <AccionesTurnoUsuario turno={turno} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </PrivateRoute>
    );
}
