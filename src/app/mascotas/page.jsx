'use client'; // Convertimos este componente a Cliente para usar hooks y PrivateRoute

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import PrivateRoute from '@/app/components/PrivateRoute';
import { FaPlusCircle, FaHeart } from 'react-icons/fa';

// El componente MascotaCard no necesita cambios, pero debe permanecer aquí.
const MascotaCard = ({ mascota }) => {
    const fechaNac = new Date(mascota.fechaNacimiento).toLocaleDateString('es-AR');
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 relative">
            {mascota.enAdopcion && (
                <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <FaHeart />
                    <span>En Adopción</span>
                </div>
            )}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{mascota.nombre}</h3>
                <p className="text-md text-gray-600"><span className="font-semibold">Especie:</span> {mascota.especie}</p>
                <p className="text-md text-gray-600"><span className="font-semibold">Raza:</span> {mascota.raza}</p>
                <p className="text-md text-gray-600"><span className="font-semibold">Nacimiento:</span> {fechaNac}</p>
            </div>
            <div className="bg-gray-50 p-4 flex justify-around">
                <Link href={`/mascotas/${mascota.id}/carnet`}>
                    <span className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors">Ver Carnet</span>
                </Link>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
            </div>
        </div>
    );
};

// El contenido real de la página, ahora separado.
const MisMascotasContent = () => {
    const { user } = useAuth();
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchMascotas = async () => {
            try {
                const mascotasRef = collection(db, 'users', user.uid, 'mascotas');
                const q = query(mascotasRef, orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const mascotasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMascotas(mascotasData);
            } catch (error) {
                console.error("Error al obtener las mascotas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMascotas();
    }, [user]);

    if (loading) {
        return <div>Cargando tus mascotas...</div>; 
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">Mis Mascotas</h1>
                    <Link href="/mascotas/nueva">
                        <span className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-5 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-lg">
                            <FaPlusCircle />
                            Añadir Mascota
                        </span>
                    </Link>
                </div>

                {mascotas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mascotas.map(mascota => (
                            <MascotaCard key={mascota.id} mascota={mascota} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center bg-white p-12 rounded-2xl shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-800">Aún no tienes mascotas registradas</h3>
                        <p className="mt-4 text-gray-600">¡No esperes más! Añade a tu primer compañero.</p>
                        <div className="mt-8">
                            <Link href="/mascotas/nueva">
                                <span className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-lg">
                                    Registrar mi Primera Mascota
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// La página ahora solo envuelve el contenido con PrivateRoute
export default function MisMascotasPage() {
    return (
        <PrivateRoute>
            <MisMascotasContent />
        </PrivateRoute>
    );
}
