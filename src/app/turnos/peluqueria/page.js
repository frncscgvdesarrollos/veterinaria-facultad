
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from '@/lib/firebaseAdmin';
import { getUserIdFromSession } from '@/lib/firebaseAdmin';

import FormularioTurnoPeluqueria from '@/app/components/FormularioTurnoPeluqueria.jsx';
import PrivateRoute from '@/app/components/PrivateRoute';

// --- LÓGICA DE DISPONIBILIDAD ---

// 1. Definimos la capacidad máxima de turnos por franja horaria.
const MAX_TURNOS_MANANA = 5;
const MAX_TURNOS_TARDE = 5;

// 2. Función para obtener la ocupación actual de los turnos.
async function getOcupacionTurnos() {
    const firestore = admin.firestore();
    const ocupacion = {}; // Objeto para guardar la cuenta: { 'YYYY-MM-DD': { manana: X, tarde: Y } }

    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Empezar desde el inicio de hoy

        const turnosSnap = await firestore.collection('turnos')
            .where('fecha', '>=', hoy.toISOString().split('T')[0]) // Solo turnos de hoy en adelante
            .where('estado', 'in', ['pendiente', 'confirmado']) // Solo contamos los que ocupan un lugar
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
        return {}; // Devolver objeto vacío en caso de error
    }
}

// 3. Función para calcular los días completamente deshabilitados
function getDiasDeshabilitados(ocupacion) {
    const disabledDays = [
        { dayOfWeek: [0, 6] }, // Fines de semana
        { before: new Date() } // Días pasados
    ];

    for (const fecha in ocupacion) {
        if (ocupacion[fecha].manana >= MAX_TURNOS_MANANA && ocupacion[fecha].tarde >= MAX_TURNOS_TARDE) {
            disabledDays.push(new Date(fecha + 'T12:00:00')); // Añadir día a la lista de deshabilitados
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
    const sessionCookie = cookies().get('__session')?.value || '';
    const userId = await getUserIdFromSession(sessionCookie);

    if (!userId) {
        redirect('/login');
    }

    // Obtenemos tanto las mascotas como la disponibilidad
    const [mascotas, ocupacion] = await Promise.all([
        getUserMascotas(userId),
        getOcupacionTurnos()
    ]);

    const disabledDays = getDiasDeshabilitados(ocupacion);

    if (mascotas.length === 0) {
        // ... (código para cuando no hay mascotas, sin cambios)
        return (
             <PrivateRoute>
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
            </PrivateRoute>
        );
    }

    // Pasamos todos los datos necesarios al formulario: mascotas y la lógica de disponibilidad.
    return (
        <PrivateRoute>
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
        </PrivateRoute>
    );
}
