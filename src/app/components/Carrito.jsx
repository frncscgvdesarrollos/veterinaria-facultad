
// --- Componente del Carrito de Compras ---
export default function Carrito({ items, onEliminarItem }) {
    // Calculamos el subtotal sumando el precio de cada item por su cantidad
    const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Mi Carrito</h3>
            {items.length === 0 ? (
                <p className="text-gray-500 text-center">Aún no has agregado productos.</p>
            ) : (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <p className="font-semibold text-gray-700">{item.nombre}</p>
                                <p className="text-sm text-gray-500">${item.precio.toLocaleString('es-AR')} x {item.cantidad}</p>
                            </div>
                            <button 
                                onClick={() => onEliminarItem(item.id)}
                                className="text-red-500 hover:text-red-700 font-semibold text-sm">
                                Quitar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Total y Botón de Checkout */}
            {items.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg mb-4">
                        <span>Subtotal:</span>
                        <span>${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">
                        Finalizar Compra
                    </button>
                </div>
            )}
        </div>
    );
}
