'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Usamos la conexión del cliente
import FormularioTurno from './FormularioTurno';

// Componente de página para solicitar un nuevo turno
export default function NuevoTurnoPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // Estados para los datos, carga y errores
    const [mascotas, setMascotas] = useState([]);
    const [servicios, setServicios] = useState({ peluqueria: {}, clinica: {} });
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si el usuario no está autenticado, redirigir al login.
        if (!authLoading && !user) {
            router.push('/login?redirectTo=/turnos/nuevo');
            return;
        }

        // Si el usuario está autenticado, cargar todos los datos necesarios desde el cliente.
        if (user) {
            const cargarDatos = async () => {
                setLoadingData(true);
                setError(null);
                try {
                    // 1. Cargar las mascotas del usuario (método cliente, como en tu página de mascotas)
                    const mascotasRef = collection(db, 'users', user.uid, 'mascotas');
                    const qMascotas = query(mascotasRef, orderBy('nombre', 'asc'));
                    const mascotasSnapshot = await getDocs(qMascotas);
                    const mascotasData = mascotasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMascotas(mascotasData);

                    // 2. Cargar los servicios (también desde el cliente)
                    const serviciosRef = collection(db, 'servicios');
                    const serviciosSnapshot = await getDocs(serviciosRef);
                    const serviciosData = { peluqueria: {}, clinica: {} };
                    serviciosSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        if (data.tipo === 'Peluquería') {
                            serviciosData.peluqueria[doc.id] = { nombre: data.nombre, precio: data.precio };
                        } else if (data.tipo === 'Clínica') {
                            serviciosData.clinica[doc.id] = { nombre: data.nombre, precio: data.precio };
                        }
                    });
                    setServicios(serviciosData);

                } catch (err) {
                    console.error("Error al cargar datos desde el cliente:", err);
                    setError('Ocurrió un error al cargar la información. Por favor, recarga la página.');
                } finally {
                    setLoadingData(false);
                }
            };

            cargarDatos();
        }
    }, [user, authLoading, router]); // Dependencias del useEffect

    // --- RENDERIZADO CONDICIONAL ---

    // Estado de carga inicial
    if (authLoading || loadingData) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-lg text-gray-500 animate-pulse">Cargando información...</p>
            </div>
        );
    }
    
    // Estado de error
    if (error) {
         return (
            <div className="text-center text-red-500 bg-red-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="font-bold text-xl mb-2">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    // Si el usuario no tiene mascotas registradas
    if (user && mascotas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Primero registra una mascota</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                    Para solicitar un turno, necesitas tener al menos una mascota registrada en tu perfil.
                </p>
                <Link href="/mascotas/nueva" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    Registrar Mi Mascota
                </Link>
            </div>
        );
    }

    // Estado de éxito: mostrar el formulario
    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 md:p-12 max-w-4xl mx-auto">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Solicitar un Nuevo Turno</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
                        Elige el servicio, la mascota y el horario que prefieras.
                    </p>
                </div>
                
                <FormularioTurno
                    user={user} // Pasamos el usuario para registrar el turno a su nombre
                    mascotas={mascotas}
                    servicios={servicios}
                />
            </div>
        </section>
    );
}
