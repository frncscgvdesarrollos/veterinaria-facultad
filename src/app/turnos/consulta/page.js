
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import admin from '@/lib/firebaseAdmin';
import { getUserIdFromSession } from '@/lib/firebaseAdmin';

import FormularioTurnoConsulta from '@/app/components/FormularioTurnoConsulta.jsx';
import PrivateRoute from '@/app/components/PrivateRoute';
import Footer from '@/app/components/Footer';

// Función para sanear los datos: convierte Timestamps a strings.
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
        if (mascotasSnap.empty) {
            return [];
        }
        return mascotasSnap.docs.map(doc => ({ id: doc.id, ...sanitizeData(doc.data()) }));
    } catch (error) {
        console.error("Error al obtener las mascotas en el servidor:", error);
        return [];
    }
}

export default async function ConsultaPage() {
    const sessionCookie = cookies().get('__session')?.value || '';
    const userId = await getUserIdFromSession(sessionCookie);

    if (!userId) {
        redirect('/login');
    }

    const mascotas = await getUserMascotas(userId);

    if (mascotas.length === 0) {
        return (
            <PrivateRoute>
                <main className="container mx-auto px-4 py-12 bg-gray-50 text-center">
                    <div className="max-w-xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Primero registra a tu mascota</h1>
                        <p className="text-gray-600 mb-6">
                            Para poder solicitar un turno, primero necesitas tener al menos una mascota registrada en tu perfil.
                        </p>
                        <a href="/mascotas/nueva" className="inline-block bg-violet-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-violet-700 transition-colors">
                            Registrar una Mascota
                        </a>
                    </div>
                </main>
                <Footer />
            </PrivateRoute>
        );
    }

    return (
        <PrivateRoute>
            <main className="container mx-auto px-4 py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800">Portal de Turnos</h1>
                    <p className="text-lg text-center text-gray-600 mb-10">Solicita un turno para una consulta veterinaria.</p>
                    
                    <FormularioTurnoConsulta mascotas={mascotas} />
                </div>
            </main>
            <Footer />
        </PrivateRoute>
    );
}
