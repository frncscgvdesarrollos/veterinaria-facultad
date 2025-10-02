
import { getUserIdFromSession } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import admin from '@/lib/firebaseAdmin';
import React from 'react'; // Importar React para usar cloneElement

async function getLayoutData(userId) {
    const firestore = admin.firestore();
    const mascotasPromise = firestore.collection('mascotas').where('usuarioId', '==', userId).get();
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const turnosPromise = firestore.collection('turnos')
        .where('fecha', '>=', hoy.toISOString().split('T')[0])
        .where('estado', 'in', ['pendiente', 'confirmado'])
        .get();

    const [mascotasSnap, turnosSnap] = await Promise.all([mascotasPromise, turnosPromise]);

    const mascotas = mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const ocupacion = {};
    turnosSnap.docs.forEach(doc => {
        const turno = doc.data();
        const fecha = turno.fecha;
        const hora = turno.hora;
        if (!ocupacion[fecha]) {
            ocupacion[fecha] = {};
        }
        if (!ocupacion[fecha][hora]) {
            ocupacion[fecha][hora] = 0;
        }
        // En lugar de contar turnos, contamos mascotas.
        // Si un turno tiene un array mascotaIds, sumamos su longitud. Si no, sumamos 1.
        const cantidadMascotas = Array.isArray(turno.mascotaIds) ? turno.mascotaIds.length : 1;
        ocupacion[fecha][hora] += cantidadMascotas;
    });

    return { mascotas, ocupacion };
}

export default async function TurnosLayout({ children, ...props }) {
    const userId = await getUserIdFromSession();

    if (!userId) {
        redirect('/login');
    }

    const { mascotas, ocupacion } = await getLayoutData(userId);

    // Adjuntamos los datos a los children para que las páginas los reciban
    const childrenWithProps = React.cloneElement(children, { mascotas, ocupacion });

    return (
        <section className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {childrenWithProps}
            </div>
        </section>
    );
}
