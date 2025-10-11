import { obtenerPrecios } from './actions';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

// Pequeño componente para renderizar cada fila de la tabla, evita repetir código.
const FilaServicio = ({ servicio, categoria }) => {
    const esPeluqueria = categoria === 'peluqueria';

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4 text-left font-medium text-gray-700">{servicio.nombre}</td>
            {esPeluqueria && (
                <td className="py-3 px-4 text-left text-gray-600 capitalize">{servicio.tamano}</td>
            )}
            <td className="py-3 px-4 text-right font-semibold text-gray-800">${servicio.precio.toLocaleString('es-AR')}</td>
            <td className="py-3 px-4 text-center">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${servicio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {servicio.activo ? 'Activo' : 'Suspendido'}
                </span>
            </td>
            <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-4">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors"><FaEdit /></button>
                    <button className="text-gray-400 hover:text-green-600 transition-colors">{servicio.activo ? <FaToggleOff/> : <FaToggleOn/>}</button>
                    <button className="text-red-500 hover:text-red-700 transition-colors"><FaTrash /></button>
                </div>
            </td>
        </tr>
    );
};


export default async function ListaServicios() {
    const precios = await obtenerPrecios();

    const renderTabla = (titulo, servicios, categoria) => (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{titulo}</h3>
            {servicios && servicios.length > 0 ? (
                 <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            {categoria === 'peluqueria' && <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>}
                            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map((servicio, index) => (
                           <FilaServicio key={index} servicio={servicio} categoria={categoria} />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay servicios de este tipo definidos.</p>
            )}
        </div>
    );

  return (
    <div>
      {renderTabla('Servicios de Peluquería', precios.peluqueria, 'peluqueria')}
      {renderTabla('Servicios Clínicos', precios.clinica, 'clinica')}
      {renderTabla('Medicamentos y Otros', precios.medicamentos, 'medicamentos')}
    </div>
  );
}
