
export default function ClientesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600 mb-8">Aquí podrás ver y administrar la información de los dueños de las mascotas.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-gray-500">Próximamente: Una tabla con la lista de clientes, buscador y la opción de ver el perfil detallado de cada uno...</p>
            {/* Aquí irá la tabla de clientes */}
        </div>
      </div>
    </div>
  );
}
