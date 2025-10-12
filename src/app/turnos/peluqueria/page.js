
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/session'; // Usamos la función de sesión correcta
import TurnoPeluqueriaClientPage from './TurnoPeluqueriaClientPage';

async function getMascotas() {
    const user = await getCurrentUser(); // Obtenemos el usuario de forma segura
    if (!user) return [];

    try {
        // Usamos el uid del usuario verificado para la consulta
        const q = collection(db, 'users', user.uid, 'mascotas');
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
        const q = query(collection(db, 'turnos'), where('tipo', '==', 'peluqueria'), where('estado', 'in', ['confirmado', 'pendiente']));
        const querySnapshot = await getDocs(q);
        const ocupacion = querySnapshot.docs.map(doc => doc.data().fecha.toDate().toISOString());
        return ocupacion;
    } catch (error) {
        console.error("Error fetching ocupacion: ", error);
        return [];
    }
}

export default async function TurnoPeluqueriaPage() {
    const mascotas = await getMascotas();
    const ocupacion = await getOcupacion();

    return <TurnoPeluqueriaClientPage mascotas={mascotas} ocupacion={ocupacion} />;
}
