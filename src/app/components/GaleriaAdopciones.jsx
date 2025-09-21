
import admin from '@/lib/firebaseAdmin';
import Image from 'next/image';
import Link from 'next/link';

// Esta es una función de servidor que obtiene los datos directamente de Firestore.
async function getMascotasEnAdopcion() {
    try {
        const firestore = admin.firestore();
        // ¡CONSULTA CORREGIDA! Ahora también ordena por fecha de creación.
        const mascotasSnapshot = await firestore
            .collectionGroup('mascotas')
            .where('enAdopcion', '==', true)
            .orderBy('createdAt', 'desc') // Mostramos las más recientes primero
            .limit(8)
            .get();

        if (mascotasSnapshot.empty) {
            return [];
        }

        const mascotas = mascotasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return mascotas;

    } catch (error) {
        console.error("Error al obtener mascotas en adopción:", error);
        // Si la consulta falla (por ejemplo, por el índice), devolvemos un array vacío.
        // La consola del servidor de Next.js mostrará un error con un enlace para crear el índice.
        return [];
    }
}

// --- Componente de la Tarjeta de Mascota ---
function MascotaCard({ mascota }) {
    // Usamos la especie para obtener una imagen más relevante. Default a 'animal' si no está definida.
    const especie = mascota.especie?.toLowerCase() === 'gato' ? 'cat' : 'dog';

    return (
        <Link href={`/adopciones/${mascota.id}`} className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-out">
            <div className="relative w-full h-56">
                <Image 
                    src={`https://loremflickr.com/320/320/${especie}?lock=${mascota.id}`} // loremflickr para fotos realistas y lock para que sea consistente
                    alt={`Foto de ${mascota.nombre}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay que aparece al hacer hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg font-bold">Ver Perfil</span>
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900 truncate">{mascota.nombre}</h3>
                    <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${ 
                        mascota.sexo === 'macho' ? 'bg-blue-200 text-blue-800' :
                        'bg-pink-200 text-pink-800'
                    }`}>
                        {mascota.sexo}
                    </span>
                </div>
                <p className="text-gray-600 capitalize mb-3">{mascota.raza}</p>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${ 
                    mascota.tamaño === 'grande' ? 'bg-red-200 text-red-800' :
                    mascota.tamaño === 'mediano' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                }`}>
                    {mascota.tamaño}
                </span>
            </div>
        </Link>
    );
}


// --- Componente Principal de la Galería ---
export default async function GaleriaAdopciones() {
    const mascotas = await getMascotasEnAdopcion();

    return (
        <section className="mb-20 md:mb-28">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">Una Nueva Oportunidad</h2>
                <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">Estos maravillosos compañeros están buscando un hogar lleno de amor. ¿Serás tú?</p>
            </div>

            {mascotas.length === 0 ? (
                <div className="text-center text-gray-600 bg-gray-50 p-10 rounded-2xl shadow-inner border border-gray-200">
                     <p className="text-lg max-w-3xl mx-auto">Por ahora no hay amiguitos buscando un nuevo hogar, ¡pero vuelve a revisar pronto!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mascotas.map(mascota => (
                        <MascotaCard key={mascota.id} mascota={mascota} />
                    ))}
                </div>
            )}
        </section>
    );
}
