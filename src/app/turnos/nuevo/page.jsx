import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuthenticatedAppForUser } from '@/lib/firebase/getAuthenticatedAppForUser';
import NuevoTurnoClientPage from './NuevoTurnoClientPage';
import { unstable_noStore as noStore } from 'next/cache';

// Función para obtener las mascotas del usuario autenticado
async function getMascotas() {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) return [];

    try {
        const mascotasRef = collection(db, `users/${currentUser.uid}/mascotas`);
        const snapshot = await getDocs(mascotasRef);
        // Ordenar alfabéticamente por nombre
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    } catch (error) {
        console.error("Error al obtener las mascotas: ", error);
        return [];
    }
}

// Función para obtener la ocupación de turnos y calcular los cupos
async function getOcupacion() {
    noStore(); // Asegura que los datos de ocupación siempre sean frescos
    try {
        const turnosRef = collection(db, 'turnos');
        const q = query(turnosRef, where('estado', 'in', ['pendiente', 'confirmado']));
        const snapshot = await getDocs(q);

        const ocupacion = {};

        snapshot.docs.forEach(doc => {
            const turno = doc.data();
            const { fecha, hora, tipo, mascotaIds } = turno;

            if (fecha && hora) {
                if (!ocupacion[fecha]) {
                    ocupacion[fecha] = {};
                }
                if (!ocupacion[fecha][hora]) {
                    ocupacion[fecha][hora] = 0;
                }

                // Para peluquería, cada perro ocupa un cupo
                if (tipo === 'peluqueria' && mascotaIds && mascotaIds.length > 0) {
                    ocupacion[fecha][hora] += mascotaIds.length;
                } else {
                // Para consultas, cada turno ocupa un cupo de veterinario
                    ocupacion[fecha][hora]++;
                }
            }
        });

        return ocupacion;
    } catch (error) {
        console.error("Error al obtener la ocupación de turnos: ", error);
        return {};
    }
}

// --- Componente de Página (Servidor) ---
export default async function NuevoTurnoPage() {
    // Obtenemos los datos en el servidor
    const mascotas = await getMascotas();
    const ocupacion = await getOcupacion();

    // Pasamos los datos al componente cliente
    return <NuevoTurnoClientPage mascotas={mascotas} ocupacion={ocupacion} />;
}
