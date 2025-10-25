'use server';

import { getMascotasEnAdopcion } from '@/lib/actions/adopciones.actions.js';
import SubHeader from '@/app/components/SubHeader';
import MascotaCardAdopcion from '@/app/components/MascotaCardAdopcion.jsx';

export default async function AdopcionesPage() {
    let mascotas = [];
    let error = null;

    try {
        mascotas = await getMascotasEnAdopcion();
    } catch (e) {
        console.error("Error en AdopcionesPage:", e);
        // Si el error es FAILED_PRECONDITION, podemos dar un mensaje más específico.
        if (e.code === 'FAILED_PRECONDITION') {
            error = "La base de datos requiere un índice para esta consulta. Por favor, crea el índice en Firestore y vuelve a intentarlo.";
        } else {
            error = "Ocurrió un error al cargar las mascotas.";
        }
    }

    return (
        <>
            <SubHeader title="Adopta un Amigo" />
            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {error && (
                        <div className="text-center py-20 bg-red-50 text-red-700 rounded-lg shadow-md">
                            <h2 className="text-3xl font-bold">Error de Configuración</h2>
                            <p className="mt-3 max-w-2xl mx-auto text-lg">{error}</p>
                            <p className="mt-4 text-md text-red-600">Si el problema persiste, contacta a soporte.</p>
                        </div>
                    )}

                    {!error && mascotas.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {mascotas.map((mascota) => (
                                <MascotaCardAdopcion key={mascota.id} mascota={mascota} />
                            ))}
                        </div>
                    )}

                    {!error && mascotas.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-lg shadow-md">
                            <h2 className="text-3xl font-bold text-gray-800">No hay Corazones Buscando Hogar</h2>
                            <p className="mt-3 text-gray-500 text-lg">¡Qué bueno! Parece que todos nuestros amigos han encontrado una familia.</p>
                            <p className="mt-2 text-gray-500">Si quieres dar una mascota en adopción, puedes hacerlo desde tu panel.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
