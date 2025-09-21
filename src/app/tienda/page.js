'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TiendaPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'producto'));
        const productosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      } catch (error) {
        console.error("Error fetching productos: ", error);
      }
      setLoading(false);
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Cargando productos...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestra Tienda</h1>
      {productos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p className="text-lg font-semibold mt-4">${producto.precio_de_venta}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-8">No hay productos disponibles en este momento.</p>
      )}
    </div>
  );
}
