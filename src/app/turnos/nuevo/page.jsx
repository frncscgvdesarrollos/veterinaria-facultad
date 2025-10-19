'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMascotasDelUsuario } from '@/lib/actions/mascotas.actions';
import { obtenerServicios } from '@/lib/actions/servicios.actions';
import FormularioTurno from './FormularioTurno';

export default function NuevoTurnoPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [mascotas, setMascotas] = useState([]);
    const [servicios, setServicios] = useState({ peluqueria: {}, clinica: {} });
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si la autenticación ha terminado y no hay usuario, redirigir.
        if (!authLoading && !user) {
            router.push('/login?redirectTo=/turnos/nuevo');
            return;
        }

        // Si hay un usuario, cargar los datos necesarios.
        if (user) {
            const cargarDatos = async () => {
                setLoadingData(true);
                try {
                    // Hacemos las llamadas en paralelo
                    const [mascotasResult, serviciosData] = await Promise.all([
                        getMascotasDelUsuario(user), // Esta función ya la teníamos
                        obtenerServicios()           // Y esta también
                    ]);

                    if (mascotasResult.success) {
                        setMascotas(mascotasResult.mascotas);
                    } else {
                        // Si falla la carga de mascotas, lo anotamos como un error
                        throw new Error(mascotasResult.error || 'No se pudieron cargar las mascotas.');
                    }
                    
                    setServicios(serviciosData || { peluqueria: {}, clinica: {} });

                } catch (err) {
                    console.error("Error al cargar datos para el turno:", err);
                    setError(err.message);
                } finally {
                    setLoadingData(false);
                }
            };

            cargarDatos();
        }
    }, [user, authLoading, router]);

    // Estado de carga mientras se verifica el usuario o se cargan los datos.
    if (authLoading || loadingData) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-lg text-gray-500">Cargando datos del turno...</p>
            </div>
        );
    }
    
    // Si hubo un error al cargar los datos.
    if (error) {
         return (
            <div className="text-center text-red-500 bg-red-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 class="font-bold text-xl mb-2">Error al cargar la página</h2>
                <p>{error}</p>
            </div>
        );
    }

    // Si el usuario está logueado pero no tiene mascotas.
    if (user && mascotas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Aún no tienes mascotas registradas</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                    Para poder solicitar un turno, primero necesitas añadir a tu compañero. ¡Es muy fácil!
                </p>
                <Link href="/mascotas/nueva" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    Registrar mi Mascota
                </Link>
            </div>
        );
    }

    // Si todo está correcto, mostramos el formulario.
    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 md:p-12 max-w-4xl mx-auto">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Solicita un Nuevo Turno</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
                        Elige el servicio y la mascota para encontrar el mejor momento.
                    </p>
                </div>
                
                <FormularioTurno
                    user={user}
                    mascotas={mascotas}
                    servicios={servicios}
                />
            </div>
        </section>
    );
}
