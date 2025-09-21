
'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// Corregido: Se elimina PawPrintIcon y se añade ArrowPathIcon
import { HeartIcon, EnvelopeIcon, UserIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

// Componente para la tarjeta de una mascota en adopción
function AdopcionCard({ mascota }) {
    const imageUrl = `https://placedog.net/500/500?random&r=${mascota.id}`;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative h-56 w-full">
                <Image 
                    className="object-cover"
                    src={imageUrl} 
                    alt={`Foto de ${mascota.nombre}`} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 m-3 rounded-full">ADOPCIÓN</div>
            </div>
            <div className="p-5">
                <h3 className="text-3xl font-extrabold text-gray-900">{mascota.nombre}</h3>
                <p className="text-md font-semibold text-violet-700 capitalize">{mascota.especie} - {mascota.raza || 'Mestizo'}</p>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 font-bold">Contacto del Dueño:</p>
                    <div className="flex items-center gap-3 mt-2">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{mascota.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <a href={`mailto:${mascota.ownerEmail}`} className="text-blue-600 hover:underline">{mascota.ownerEmail}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdopcionesPage() {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adopcionesRef = collection(db, 'adopciones');
        const q = query(adopcionesRef, orderBy('fechaRegistro', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mascotasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMascotas(mascotasData);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener las mascotas en adopción:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
             <div className="flex justify-center items-center h-screen bg-violet-100">
                <div className="text-center">
                    {/* Corregido: Se reemplaza PawPrintIcon por ArrowPathIcon para la carga */}
                    <ArrowPathIcon className="animate-spin h-12 w-12 text-violet-600 mx-auto" />
                    <p className="text-violet-800 font-semibold mt-2">Buscando nuevos hogares...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-violet-200 font-sans">
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <HeartIcon className="mx-auto h-16 w-16 text-rose-500"/>
                    <h1 className="text-5xl font-extrabold text-gray-900 mt-4">Encuentra a tu Nuevo Mejor Amigo</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Estas mascotas buscan un hogar lleno de amor. Contacta directamente a sus dueños para darles una nueva oportunidad.</p>
                </div>

                {mascotas.length === 0 ? (
                    <div className="text-center bg-white/60 backdrop-blur-sm p-12 rounded-2xl shadow-lg">
                        {/* Corregido: Se reemplaza PawPrintIcon por un HeartIcon temático */}
                        <HeartIcon className="mx-auto h-16 w-16 text-violet-400" />
                        <h2 className="mt-6 text-2xl font-bold text-gray-800">¡Qué bien!</h2>
                        <p className="text-gray-600 mt-2 max-w-prose mx-auto">Actualmente, todas nuestras mascotas tienen un hogar. ¡Vuelve pronto para ver si hay nuevos amigos buscando familia!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mascotas.map(mascota => (
                            <AdopcionCard key={mascota.id} mascota={mascota} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
