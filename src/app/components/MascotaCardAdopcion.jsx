'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HeartIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { postularseParaAdopcion } from '@/lib/actions/adopciones.actions.js';

export default function MascotaCardAdopcion({ mascota }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const imageUrl = mascota.fotos && mascota.fotos.length > 0 ? mascota.fotos[0] : '/img/placeholder-dog.jpg';

    const handlePostulacion = async () => {
        if (!user) {
            setError('Debes iniciar sesión para postularte.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await postularseParaAdopcion(mascota.path, {
                uid: user.uid,
                nombre: user.displayName || 'Usuario anónimo',
                email: user.email,
            });

            if (result.success) {
                setMessage(result.message);
            } else {
                setError(result.message);
            }
        } catch (e) {
            setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
        }

        setLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="relative h-64 w-full">
                <Image
                    src={imageUrl}
                    alt={`Foto de ${mascota.nombre}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
                    <HeartIcon className="h-6 w-6 text-red-400" />
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">{mascota.nombre}</h3>
                <p className="text-gray-600 mb-4">{mascota.raza}</p>
                
                <div className="mt-auto border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700 font-medium truncate">{mascota.ownerName || 'No disponible'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                        <a href={`mailto:${mascota.ownerEmail}`} className="text-blue-600 hover:underline break-all">{mascota.ownerEmail}</a>
                    </div>
                </div>
                <div className="mt-5">
                    <button
                        onClick={handlePostulacion}
                        disabled={loading || message}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando postulación...' : (message ? 'Postulación enviada' : 'Me quiero postular')}
                    </button>
                    {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
                    {message && !error && <p className="mt-2 text-sm text-center text-green-600">{message}</p>}
                </div>
            </div>
        </div>
    );
}
