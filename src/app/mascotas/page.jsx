'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import PrivateRoute from '@/app/components/PrivateRoute';
import { FaPlusCircle, FaHeart } from 'react-icons/fa';

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
        return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>; 
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                 <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                    {/* Cabecera con navegación y título */}
                    <div className="flex items-center mb-8">
                        <Link href="/" legacyBehavior>
                            <a className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                <span className="ml-1 font-medium">Volver</span>
                            </a>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Mis Mascotas</h1>
                        <div className="w-full ml-6 border-b-2 border-dotted border-gray-300"></div>
                        <Link href="/mascotas/nueva" legacyBehavior>
                            <a className="ml-6 flex-shrink-0 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-lg">
                                <FaPlusCircle />
                                Añadir
                            </a>
                        </Link>
                    </div>

                    {mascotas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mascotas.map(mascota => (
                                <MascotaCard key={mascota.id} mascota={mascota} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <h3 className="text-2xl font-semibold text-gray-800">Aún no tienes mascotas registradas</h3>
                            <p className="mt-4 text-gray-600">¡No esperes más! Añade a tu primer compañero.</p>
                            <div className="mt-8">
                                <Link href="/mascotas/nueva" legacyBehavior>
                                    <a className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-lg">
                                        Registrar mi Primera Mascota
                                    </a>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MisMascotasPage() {
    return (
        <PrivateRoute>
            <MisMascotasContent />
        </PrivateRoute>
    );
}
