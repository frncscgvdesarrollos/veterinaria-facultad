
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/session';
import TurnoConsultaClientPage from './TurnoConsultaClientPage';

async function getMascotas() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        const q = collection(db, 'users', user.uid, 'mascotas');
        const querySnapshot = await getDocs(q);
        
        // ¡CORRECCIÓN! Serializar los datos de fecha antes de pasarlos al cliente.
        const mascotas = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Aseguramos que las fechas sean texto plano (string)
                fechaNacimiento: data.fechaNacimiento?.toDate ? data.fechaNacimiento.toDate().toISOString() : data.fechaNacimiento,
                fechaRegistro: data.fechaRegistro?.toDate ? data.fechaRegistro.toDate().toISOString() : data.fechaRegistro,
            };
        });

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
