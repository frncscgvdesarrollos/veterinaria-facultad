
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { agregarMascota } from '@/app/actions';
import { Timestamp } from 'firebase/firestore'; // Importamos Timestamp

export default function FormularioNuevaMascota() {
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!user) {
            setError('Debes iniciar sesión para registrar una mascota.');
            setLoading(false);
            return;
        }

        const formData = new FormData(event.currentTarget);
        const mascotaData = {
            nombre: formData.get('nombre'),
            especie: formData.get('especie'),
            raza: formData.get('raza'),
            fechaNacimiento: formData.get('fechaNacimiento'),
            sexo: formData.get('sexo'), 
            tamaño: formData.get('tamaño'),
            enAdopcion: formData.get('enAdopcion') === 'on',
            createdAt: Timestamp.now() 
        };


        if (!mascotaData.nombre || !mascotaData.especie || !mascotaData.raza || !mascotaData.fechaNacimiento || !mascotaData.sexo) {
            setError("Por favor, completa todos los campos obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const result = await agregarMascota(user.uid, mascotaData);

            if (result.success) {
                setSuccess('¡Mascota registrada con éxito! En breve serás redirigido...');
                event.target.reset();
                setTimeout(() => {
                    window.location.href = '/mascotas';
                }, 2000);
            } else {
                setError(result.error || 'Ocurrió un error inesperado.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" name="nombre" id="nombre" required className="mt-1 block w-full input" placeholder="Ej: Rocky" disabled={loading} />
                </div>
                <div>
                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <input type="date" name="fechaNacimiento" id="fechaNacimiento" required className="mt-1 block w-full input" disabled={loading} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="especie" className="block text-sm font-medium text-gray-700">Especie</label>
                    <input type="text" name="especie" id="especie" required className="mt-1 block w-full input" placeholder="Ej: Perro" disabled={loading} />
                </div>
                <div>
                    <label htmlFor="raza" className="block text-sm font-medium text-gray-700">Raza</label>
                    <input type="text" name="raza" id="raza" required className="mt-1 block w-full input" placeholder="Ej: Labrador" disabled={loading} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                    <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">Sexo</label>
                    <select name="sexo" id="sexo" required className="mt-1 block w-full input" disabled={loading}>
                        <option value="">Selecciona...</option>
                        <option value="macho">Macho</option>
                        <option value="hembra">Hembra</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="tamaño" className="block text-sm font-medium text-gray-700">Tamaño</label>
                    <select name="tamaño" id="tamaño" required className="mt-1 block w-full input" disabled={loading}>
                        <option value="pequeño">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center pt-4">
                <input id="enAdopcion" name="enAdopcion" type="checkbox" className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" disabled={loading} />
                <label htmlFor="enAdopcion" className="ml-3 block text-sm text-gray-900">Marcar para poner en adopción</label>
            </div>
            
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}

            <div className="pt-6">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-300 disabled:bg-violet-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Guardando...' : 'Registrar Mascota'}
                </button>
            </div>
        </form>
    );
}
