'use client';

import { useState } from 'react';
import Image from 'next/image';
import Carrito from './Carrito';

const productosDeMuestra = [
    { id: 1, nombre: 'Alimento Premium', descripcion: 'Bolsa de 15kg para perros', precio: 55000.00, imagen: 'dog,food' },
    { id: 2, nombre: 'Juguete Hueso de Goma', descripcion: 'Resistente y seguro para la mordida', precio: 7500.00, imagen: 'dog,toy' },
    { id: 3, nombre: 'Collar de Cuero Ajustable', descripcion: 'Elegante y duradero para paseos', precio: 12000.00, imagen: 'dog,collar' },
    { id: 4, nombre: 'Shampoo Hipoalergénico', descripcion: 'Cuidado suave para pieles sensibles', precio: 9800.00, imagen: 'pet,shampoo' },
];

function ProductoCard({ producto, onAgregarAlCarrito }) {
    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300 ease-out">
            <div className="relative w-full h-48">
                <Image 
                    src={`https://source.unsplash.com/500x500/?${producto.imagen}`}
                    alt={`Imagen de ${producto.nombre}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className="p-5 flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 mb-3">{producto.descripcion}</p>
                <p className="text-2xl font-black text-violet-700">${producto.precio.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                 <button 
                    onClick={() => onAgregarAlCarrito(producto)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-out flex items-center justify-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l.893-.892L7.383 9.5l.01-.042L8.846 3.5l.01-.042h7.444a1 1 0 00.97-.733l2-5a1 1 0 00-.97-1.267H3zM6.002 11.5l-1.1 4.4a1 1 0 101.998.2L7 11.5H6.002zM15 16a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                     <span>Agregar</span>
                 </button>
            </div>
        </div>
    );
}

export default function VistaTienda() {
    const [carrito, setCarrito] = useState([]);

    const handleAgregarAlCarrito = (producto) => {
        const productoExistente = carrito.find(item => item.id === producto.id);
        if (productoExistente) {
            setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const handleEliminarDelCarrito = (productoId) => {
        setCarrito(carrito.filter(item => item.id !== productoId));
    };

    return (
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {productosDeMuestra.map(producto => (
                        <ProductoCard key={producto.id} producto={producto} onAgregarAlCarrito={handleAgregarAlCarrito} />
                    ))}
                </div>
                <div className="lg:col-span-1 sticky top-28"> 
                    <Carrito items={carrito} onEliminarItem={handleEliminarDelCarrito} />
                </div>
            </div>
        </section>
    );
}
