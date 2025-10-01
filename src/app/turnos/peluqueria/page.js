
import { getUserIdFromSession } from '@/lib/firebaseAdmin';
import admin from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import FormularioTurnoPeluqueria from '@/app/components/FormularioTurnoPeluqueria.jsx';

// --- LÓGICA DE DISPONIBILIDAD ---

const MAX_TURNOS_MANANA = 5;
const MAX_TURNOS_TARDE = 5;

async function getOcupacionTurnos() {
    const firestore = admin.firestore();
    const ocupacion = {};
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const turnosSnap = await firestore.collection('turnos')
            .where('fecha', '>=', hoy.toISOString().split('T')[0])
            .where('estado', 'in', ['pendiente', 'confirmado'])
            .get();

        turnosSnap.docs.forEach(doc => {
            const turno = doc.data();
            const fecha = turno.fecha;
            if (!ocupacion[fecha]) {
                ocupacion[fecha] = { manana: 0, tarde: 0 };
            }
            if (turno.turno === 'manana') {
                ocupacion[fecha].manana += 1;
            }
            if (turno.turno === 'tarde') {
                ocupacion[fecha].tarde += 1;
            }
        });
        return ocupacion;
    } catch (error) {
        console.error("Error al calcular la ocupación de turnos:", error);
        return {};
    }
}

function getDiasDeshabilitados(ocupacion) {
    const disabledDays = [
        { dayOfWeek: [0, 6] },
        { before: new Date() }
    ];
    for (const fecha in ocupacion) {
        if (ocupacion[fecha].manana >= MAX_TURNOS_MANANA && ocupacion[fecha].tarde >= MAX_TURNOS_TARDE) {
            disabledDays.push(new Date(fecha + 'T12:00:00'));
        }
    }
    return disabledDays;
}

// --- FUNCIONES EXISTENTES (con saneamiento) ---

const sanitizeData = (docData) => {
  if (!docData) return null;
  const data = { ...docData };
  for (const key in data) {
    if (data[key] && typeof data[key].toDate === 'function') {
      data[key] = data[key].toDate().toISOString();
    }
  }
  return data;
};

async function getUserMascotas(userId) {
    if (!userId) return [];
    const firestore = admin.firestore();
    try {
        const mascotasSnap = await firestore.collection('users').doc(userId).collection('mascotas').orderBy('nombre', 'asc').get();
        return mascotasSnap.docs.map(doc => ({ id: doc.id, ...sanitizeData(doc.data()) }));
    } catch (error) {
        console.error("Error al obtener las mascotas:", error);
        return [];
    }
}

export default async function PeluqueriaPage() {
    // 1. Verificar la sesión del usuario.
    const userId = await getUserIdFromSession();

    // 2. Si no está autenticado, redirigir a login.
    if (!userId) {
        redirect('/login?redirect=/turnos/peluqueria');
    }

    const [mascotas, ocupacion] = await Promise.all([
        getUserMascotas(userId),
        getOcupacionTurnos()
    ]);

    const disabledDays = getDiasDeshabilitados(ocupacion);

    if (mascotas.length === 0) {
        return (
            <main className="container mx-auto px-4 py-12 bg-gray-50 text-center">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Primero registra a tu mascota</h1>
                    <p className="text-gray-600 mb-6">
                        Para poder solicitar un turno de peluquería, primero necesitas tener al menos una mascota registrada en tu perfil.
                    </p>
                    <a href="/mascotas/nueva" className="inline-block bg-violet-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-violet-700 transition-colors">
                        Registrar una Mascota
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <FormularioTurnoPeluqueria 
                    mascotas={mascotas} 
                    ocupacion={ocupacion} 
                    disabledDays={disabledDays} 
                    maxTurnosManana={MAX_TURNOS_MANANA}
                    maxTurnosTarde={MAX_TURNOS_TARDE}
                />
            </div>
        </main>
    );
}
