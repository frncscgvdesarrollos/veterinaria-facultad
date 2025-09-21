
'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-[75vh] min-h-[450px] flex items-center justify-center text-white text-center bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1559190394-df5781622795?q=80&w=2070&auto=format&fit=crop" 
                    alt="Perro feliz siendo atendido en una clínica veterinaria"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    Cuidado y Confianza para tu Fiel Compañero
                </h1>
                <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                    En la Veterinaria Magali, combinamos pasión y profesionalismo para ofrecer el mejor servicio. Desde consultas hasta peluquería, estamos aquí para ti y tu mascota.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/turnos/consulta">
                        <span className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            Pedir un Turno
                        </span>
                    </Link>
                    <Link href="#servicios">
                        <span className="bg-white hover:bg-gray-200 text-violet-700 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                            Nuestros Servicios
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
