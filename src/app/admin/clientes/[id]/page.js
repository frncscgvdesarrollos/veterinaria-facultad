
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase'; // <-- CORREGIDO
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
// import StarRating from '@/app/components/StarRating';

const ClienteDetallePage = () => {
  const { userRole } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params; // El ID del cliente desde la URL

  const [cliente, setCliente] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'admin' || !id) {
        if(userRole && userRole !== 'admin') router.push('/');
        return;
    }

    const fetchClienteYMascotas = async () => {
      setLoading(true);
      try {
        // 1. Obtener datos del cliente
        const clienteRef = doc(db, 'users', id); // <-- CORREGIDO
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
          setCliente({ id: clienteSnap.id, ...clienteSnap.data() });
        } else {
          console.error("No se encontró el cliente.");
          router.push('/admin/clientes');
          return;
        }

        // 2. Obtener mascotas del cliente
        const mascotasRef = collection(db, 'pets'); // <-- CORREGIDO
        const q = query(mascotasRef, where("ownerId", "==", id));
        const mascotasSnap = await getDocs(q);
        const mascotasData = mascotasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMascotas(mascotasData);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
      setLoading(false);
    };

    fetchClienteYMascotas();
  }, [id, userRole, router]);

  const handleRatingChange = async (clientId, newRating) => {
    if (userRole !== 'admin') return;
    try {
        const clientRef = doc(db, 'users', clientId); // <-- CORREGIDO
        await updateDoc(clientRef, { rating: newRating });
        setCliente(prev => ({...prev, rating: newRating}));
    } catch (error) {
        console.error("Error al actualizar la calificación: ", error);
    }
  };

  if (loading || !userRole) {
    return <p className="text-center mt-8">Cargando datos del cliente...</p>;
  }

  if (userRole !== 'admin') {
    return <p className="text-red-500 text-center mt-8">No tienes permiso para ver esta página.</p>;
  }
  
  if (!cliente) {
    return (
        <div className="text-center mt-8">
            <p>No se pudo encontrar la información del cliente.</p>
            <button onClick={() => router.push('/admin/clientes')} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Volver a la lista
            </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-6 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Volver
        </button>

        {/* Tarjeta de Información del Cliente */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mr-4">{cliente.displayName}</h1>
                {/* <div className="mt-2 sm:mt-0">
                    <StarRating clientId={cliente.id} initialRating={cliente.rating || 0} onRatingChange={handleRatingChange} />
                </div> */}
            </div>
            <div className="text-gray-600 space-y-2">
                <p><strong>Email:</strong> {cliente.email}</p>
                <p><strong>Teléfono:</strong> {cliente.phone || 'No especificado'}</p>
            </div>
        </div>

        {/* Sección de Mascotas */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Mascotas Registradas</h2>
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            {mascotas.length > 0 ? (
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Especie</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Raza</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Edad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mascotas.map(mascota => (
                            <tr key={mascota.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{mascota.name || 'N/A'}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{mascota.species || 'N/A'}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{mascota.breed || 'N/A'}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{mascota.age ? `${mascota.age} años` : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center p-5">
                    <p className="text-gray-500">Este cliente aún no ha registrado ninguna mascota.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ClienteDetallePage;
