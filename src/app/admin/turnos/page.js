
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin, { getUserIdFromSession } from '@/lib/firebaseAdmin';
import Link from 'next/link';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import TurnoActions from '@/app/admin/TurnoActions'; // Importamos el nuevo componente de cliente

// --- Funciones y Componentes del Servidor ---

// Función para sanear los datos: convierte Timestamps a strings.
const sanitizeData = (docData) => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] && typeof data[key].toDate === 'function') {
      // Convertir Timestamp a string ISO. El componente que lo use lo puede formatear.
      data[key] = data[key].toDate().toISOString();
    }
  }
  return data;
};

async function getTurnoDetails(turno) {
    const firestore = admin.firestore();
    let mascotaData = {};
    let clienteData = {};
    try {
        const mascotaSnap = await firestore.collection('users').doc(turno.clienteId).collection('mascotas').doc(turno.mascotaId).get();
        if (mascotaSnap.exists) mascotaData = sanitizeData(mascotaSnap.data());

        const clienteSnap = await firestore.collection('users').doc(turno.clienteId).get();
        if (clienteSnap.exists) clienteData = sanitizeData(clienteSnap.data());
    } catch (error) {
        console.error(`Error fetching details for turno ${turno.id}:`, error);
    }
    return {
        ...turno,
        mascotaNombre: mascotaData.nombre || 'N/A',
        clienteNombre: clienteData.displayName || clienteData.email || 'N/A',
    };
}

const TurnoCard = ({ turno }) => {
    const cardBgColor = turno.estado === 'pendiente' ? 'bg-yellow-100 border-yellow-400' : 
                        turno.estado === 'confirmado' ? 'bg-green-100 border-green-400' : 
                        'bg-red-100 border-red-400';

    const statusIcon = turno.estado === 'pendiente' ? <FiClock className="text-yellow-500" /> :
                       turno.estado === 'confirmado' ? <FiCheckCircle className="text-green-500" /> :
                       <FiXCircle className="text-red-500" />;

    return (
        <div className={`p-4 rounded-lg border ${cardBgColor} shadow-sm flex flex-col justify-between`}>
            <div>
                <div className="flex items-center mb-2">
                    {statusIcon}
                    <span className="ml-2 font-semibold capitalize">{turno.estado}</span>
                </div>
                <h3 className="text-lg font-bold">{turno.tipo === 'peluqueria' ? 'Peluquería' : 'Consulta'}</h3>
                <p className="text-sm text-gray-600">Mascota: <span className="font-medium">{turno.mascotaNombre}</span></p>
                <p className="text-sm text-gray-600">Dueño: <span className="font-medium">{turno.clienteNombre}</span></p>
                <p className="text-sm text-gray-600">Fecha: <span className="font-medium">{new Date(turno.fecha).toLocaleDateString()}</span></p>
                {turno.turno && <p className="text-sm text-gray-600">Horario: <span className="font-medium">{turno.turno}</span></p>}
            </div>
            {/* Solo mostramos las acciones si el turno está pendiente */}
            {turno.estado === 'pendiente' && <TurnoActions turnoId={turno.id} />}
        </div>
    );
};

export default async function AdminTurnosPage() {
    const sessionCookie = cookies().get('__session')?.value || '';
    const userId = await getUserIdFromSession(sessionCookie);

    if (!userId) redirect('/login');

    const firestore = admin.firestore();
    const userDocSnap = await firestore.collection('users').doc(userId).get();
    const userRole = userDocSnap.data()?.role;

    if (userRole !== 'admin') redirect('/');

    const turnosSnap = await firestore.collection('turnos').orderBy('createdAt', 'desc').get();
    
    // Mapeamos y SANEAMOS los datos aquí, en el Server Component.
    const turnosList = turnosSnap.docs.map(doc => ({ id: doc.id, ...sanitizeData(doc.data()) }));

    const turnosConDetalles = await Promise.all(turnosList.map(getTurnoDetails));

    const turnosPendientes = turnosConDetalles.filter(t => t.estado === 'pendiente');
    const turnosConfirmados = turnosConDetalles.filter(t => t.estado === 'confirmado');
    const turnosCancelados = turnosConDetalles.filter(t => t.estado === 'cancelado');

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Administración de Turnos</h1>
                <Link href="/" className="text-violet-600 hover:text-violet-800">&larr; Volver al inicio</Link>
            </header>

            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Turnos Pendientes ({turnosPendientes.length})</h2>
                {turnosPendientes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {turnosPendientes.map(turno => <TurnoCard key={turno.id} turno={turno} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay turnos pendientes de revisión.</p>
                )}
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Turnos Confirmados ({turnosConfirmados.length})</h2>
                {turnosConfirmados.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {turnosConfirmados.map(turno => <TurnoCard key={turno.id} turno={turno} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay turnos confirmados.</p>
                )}
            </section>

             <section className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Turnos Cancelados ({turnosCancelados.length})</h2>
                {turnosCancelados.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {turnosCancelados.map(turno => <TurnoCard key={turno.id} turno={turno} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay turnos cancelados.</p>
                )}
            </section>
        </div>
    );
}
