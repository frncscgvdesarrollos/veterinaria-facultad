'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMascotasDelUsuario } from '@/app/actions/mascotasActions'; // Importación correcta
import { FaArrowLeft, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '@/app/firebase/AuthProvider'; // Necesitamos el usuario

export default function Paso4_SeleccionarMascota({ datosPrevios, alSiguiente, alAnterior }) {
  const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticación

  const [mascotas, setMascotas] = useState([]);
  const [mascotasSeleccionadas, setMascotasSeleccionadas] = useState(datosPrevios.mascotas || []);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const cargarMascotas = async () => {
        setCargando(true);
        setError(null);
        const resultado = await getMascotasDelUsuario(user);
        if (resultado.success) {
          setMascotas(resultado.mascotas);
        } else {
          setError(resultado.error);
        }
        setCargando(false);
      };
      cargarMascotas();
    }
  }, [user]);

  const handleSeleccion = (mascotaId) => {
    setMascotasSeleccionadas(prev =>
      prev.includes(mascotaId) ? prev.filter(id => id !== mascotaId) : [...prev, mascotaId]
    );
  };

  const handleConfirmar = () => {
    alSiguiente({ mascotas: mascotasSeleccionadas });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={alAnterior} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-700 text-center">¿Para quién es el turno?</h2>
        <Link href="/mis-mascotas/nueva" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FaPlusCircle className="text-blue-600 text-2xl" title="Añadir nueva mascota" />
        </Link>
      </div>

      {cargando && <p className="text-center text-gray-500">Buscando tus mascotas...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && !error && mascotas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              onClick={() => handleSeleccion(mascota.id)}
              className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                mascotasSeleccionadas.includes(mascota.id)
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}>
              <div className="relative w-full h-24 md:h-32 rounded-md overflow-hidden mb-2">
                  <Image src={mascota.fotoUrl || 'https://via.placeholder.com/150'} alt={mascota.nombre} layout="fill" objectFit="cover" />
              </div>
              <p className="font-semibold text-center text-gray-800 truncate">{mascota.nombre}</p>
              <p className="text-xs text-center text-gray-500">{mascota.raza}</p>
            </div>
          ))}
        </div>
      )}

      {!cargando && !error && mascotas.length === 0 && (
        <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-600 mb-4">No hemos encontrado mascotas en tu perfil.</p>
            <Link href="/mis-mascotas/nueva" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                <FaPlusCircle className="mr-2" />
                Añadir una mascota
            </Link>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button onClick={alAnterior} className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
          Volver
        </button>
        <button
          onClick={handleConfirmar}
          disabled={mascotasSeleccionadas.length === 0}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
