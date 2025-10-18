'use server';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-config'; // Asegúrate de que esta ruta sea correcta

export async function getServiciosPorCategoria(categoria) {
  if (!['clinica', 'peluqueria'].includes(categoria)) {
    console.error('Categoría no válida:', categoria);
    return { error: 'Categoría no válida.', servicios: [] };
  }

  try {
    const docRef = doc(db, 'servicios', 'catalogo');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('El documento catalogo/servicios no existe.');
      return { error: 'No se encontraron servicios configurados.', servicios: [] };
    }

    const data = docSnap.data();
    const serviciosCategoria = data[categoria] || {};

    // Convertir el mapa de servicios en un array de objetos
    const serviciosArray = Object.entries(serviciosCategoria).map(([id, servicio]) => ({
      id,
      ...servicio,
    }));

    return { servicios: serviciosArray };

  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    return { error: 'Ocurrió un error al cargar los servicios.', servicios: [] };
  }
}
