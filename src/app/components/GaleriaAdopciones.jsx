
import { getMascotasEnAdopcion } from '@/app/actions/adopcionesActions.js';
import { HeartIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

// --- Sub-componente para la tarjeta de una mascota (Con Estilo Sutil) ---
function AdopcionCard({ mascota }) {
    const imageUrl = `https://loremflickr.com/500/500/${mascota.especie || 'animal'}?random=${mascota.id}`;

    const calcularEdad = (fechaNac) => {
        if (!fechaNac) return 'Edad desconocida';
        const nacimiento = typeof fechaNac === 'string' ? new Date(fechaNac) : fechaNac.toDate();
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        if (edad < 0) return 'Próximamente!';
        if (edad === 0) return 'Menos de 1 año';
        return `${edad} años`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/80">
            <div className="relative h-60 w-full">
                <Image 
                    className="object-cover"
                    src={mascota.fotoUrl || imageUrl}
                    alt={`Foto de ${mascota.nombre}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute top-0 right-0 bg-violet-100 text-violet-800 text-xs font-bold px-3 py-1 m-3 rounded-full shadow-sm">EN ADOPCIÓN</div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-bold text-gray-800">{mascota.nombre}</h3>
                    <p className="text-sm font-semibold text-violet-600 capitalize">{mascota.sexo}</p>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                     <p className="text-md font-medium text-gray-600 capitalize">{mascota.raza || 'Mestizo'}</p>
                     <p className="text-sm font-medium text-gray-500">{calcularEdad(mascota.fechaNacimiento)}</p>
                </div>
               
                <div className="pt-3">
                     <button className="w-full bg-white text-rose-500 border-2 border-rose-500 font-bold py-2 px-4 rounded-lg hover:bg-rose-500 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                        <HeartIcon className="h-5 w-5" />
                        ¡Quiero Adoptar!
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Componente Principal de la Galería ---
export default async function GaleriaAdopciones() {
    const resultado = await getMascotasEnAdopcion();

    if (resultado.error) {
        // ... (código de manejo de errores sin cambios)
    }
    if (resultado.length === 0) {
        // ... (código para galería vacía sin cambios)
    }

    const mascotas = resultado;

    return (
        <div className="w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mascotas en adopción</h2>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                    ¡Estas hermosas mascotas están buscando un hogar!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {mascotas.map(mascota => (
                    <AdopcionCard key={mascota.id} mascota={mascota} />
                ))}
            </div>
        </div>
    );
}
