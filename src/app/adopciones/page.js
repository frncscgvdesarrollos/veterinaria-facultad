'use server';

import { getMascotasEnAdopcion } from '@/app/actions/adopcionesActions';
import SubHeader from '@/app/components/SubHeader';
import Image from 'next/image';
import { HeartIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

function MascotaCard({ mascota }) {
    const imageUrl = mascota.fotos && mascota.fotos.length > 0 ? mascota.fotos[0] : '/img/placeholder-dog.jpg';

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className="relative h-64 w-full">
                <Image
                    src={imageUrl}
                    alt={`Foto de ${mascota.nombre}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
                    <HeartIcon className="h-6 w-6 text-red-400" />
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">{mascota.nombre}</h3>
                <p className="text-gray-600 mb-4">{mascota.raza}</p>
                
                <div className="mt-auto border-t pt-4 space-y-2">
                    <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">{mascota.ownerName || 'No disponible'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                        <a href={`mailto:${mascota.ownerEmail}`} className="text-blue-600 hover:underline break-all">{mascota.ownerEmail}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function AdopcionesPage() {
    let mascotas = [];
    let error = null;

    try {
        mascotas = await getMascotasEnAdopcion();
    } catch (e) {
        console.error(e);
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
            <main className="max-w-7xl mx-auto p-4 md:p-8">
                {error && (
                    <div className="text-center py-20 bg-red-50 text-red-700 rounded-lg">
                        <h2 className="text-2xl font-semibold">Error de Configuración</h2>
                        <p className="mt-2 max-w-2xl mx-auto">{error}</p>
                        <p className="mt-4 text-sm text-red-600">ID del Índice requerido: CICAgOjXh4EK</p>
                    </div>
                )}

                {!error && mascotas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mascotas.map((mascota) => (
                            <MascotaCard key={mascota.id} mascota={mascota} />
                        ))}
                    </div>
                )}

                {!error && mascotas.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-gray-700">No hay mascotas para adoptar</h2>
                        <p className="mt-2 text-gray-500">¡Vuelve a consultar pronto o sé el primero en poner una mascota en adopción!</p>
                    </div>
                )}
            </main>
        </>
    );
}
