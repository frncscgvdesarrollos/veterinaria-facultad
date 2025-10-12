
import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import TurnoConsultaClientPage from './TurnoConsultaClientPage';

async function getMascotas() {
    const cookieStore = cookies();
    const session = cookieStore.get('__session');
    if (!session) return [];

    try {
        const sessionData = JSON.parse(session.value);
        // Corregido: Apuntar a la subcolección de mascotas del usuario
        const q = collection(db, 'users', sessionData.uid, 'mascotas');
        const querySnapshot = await getDocs(q);
        const mascotas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return mascotas;
    } catch (error) {
        console.error("Error fetching mascotas: ", error);
        return [];
    }
}

async function getOcupacion() {
    try {
        const q = query(collection(db, 'turnos'), where('estado', 'in', ['confirmado', 'pendiente']));
        const querySnapshot = await getDocs(q);
        const ocupacion = querySnapshot.docs.map(doc => doc.data().fecha.toDate().toISOString());
        return ocupacion;
    } catch (error) {
        console.error("Error fetching ocupacion: ", error);
        return [];
    }
}

export default async function TurnoConsultaPage() {
    const mascotas = await getMascotas();
    const ocupacion = await getOcupacion();

    return <TurnoConsultaClientPage mascotas={mascotas} ocupacion={ocupacion} />;
}
