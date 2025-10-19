'use client';

import { useState, useMemo } from 'react';
import { FaPaw, FaCut, FaStethoscope, FaChevronRight, FaCheckCircle, FaDog, FaCat, FaCalendarAlt, FaClock, FaPen } from 'react-icons/fa';

// Componente de Campo de Formulario reutilizable
const FormInput = ({ id, label, children }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
            {label}
        </label>
        {children}
    </div>
);

// Componente de Selección de Categoría (Paso 1)
const CategoriaStep = ({ onSelect }) => (
    <div className="text-center">
        <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">¿Qué tipo de servicio necesitas?</h3>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            <button onClick={() => onSelect('clinica')} className="flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-400">
                <FaStethoscope className="text-5xl text-blue-500 mb-4" />
                <span className="text-xl font-semibold text-blue-800 dark:text-blue-200">Clínica Veterinaria</span>
            </button>
            <button onClick={() => onSelect('peluqueria')} className="flex flex-col items-center justify-center p-8 bg-pink-50 hover:bg-pink-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-pink-400">
                <FaCut className="text-5xl text-pink-500 mb-4" />
                <span className="text-xl font-semibold text-pink-800 dark:text-pink-200">Peluquería Canina</span>
            </button>
        </div>
    </div>
);

// Componente para el resto de los pasos del formulario
export default function FormularioTurno({ user, mascotas, servicios }) {
    const [step, setStep] = useState(1);
    const [categoria, setCategoria] = useState(null);
    const [mascotaId, setMascotaId] = useState('');
    const [servicioId, setServicioId] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [notas, setNotas] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleCategoriaSelect = (cat) => {
        setCategoria(cat);
        if (cat !== categoria) {
            setMascotaId('');
            setServicioId('');
            const mascotaSeleccionada = mascotas.find(m => m.id === mascotaId);
            if (cat === 'peluqueria' && mascotaSeleccionada?.especie.toLowerCase() === 'gato') {
                setMascotaId('');
            }
        }
        setStep(2); // Avanzamos al siguiente paso
    };
    
    const serviciosDisponibles = useMemo(() => {
        if (!categoria) return {};
        return servicios[categoria] || {};
    }, [categoria, servicios]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        // ... (Lógica de envío que ya tienes)
        alert('Turno solicitado (simulación). ¡Gracias!');
        setIsSubmitting(false);
    };
    
    // Renderizado del formulario principal
    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {step === 1 ? (
                <CategoriaStep onSelect={handleCategoriaSelect} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 mb-6">← Cambiar tipo de servicio</button>
                    
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-3">Completa los detalles del turno</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {/* Columna Izquierda */}
                        <div>
                             <FormInput id="mascota" label="1. Tu Mascota">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                        {mascotas.find(m => m.id === mascotaId)?.especie?.toLowerCase() === 'gato' ? <FaCat/> : <FaDog/>}
                                    </span>
                                    <select id="mascota" value={mascotaId} onChange={(e) => setMascotaId(e.target.value)} required className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option value="" disabled>Selecciona tu mascota...</option>
                                        {mascotas.map(m => (
                                            <option key={m.id} value={m.id} disabled={categoria === 'peluqueria' && m.especie.toLowerCase() === 'gato'}>
                                                {m.nombre} ({m.especie}) {categoria === 'peluqueria' && m.especie.toLowerCase() === 'gato' ? '- No disponible' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </FormInput>

                             <FormInput id="servicio" label="2. Servicio Requerido">
                                 <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaStethoscope /></span>
                                     <select id="servicio" value={servicioId} onChange={(e) => setServicioId(e.target.value)} required disabled={!mascotaId} className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50">
                                        <option value="" disabled>Selecciona un servicio...</option>
                                        {Object.entries(serviciosDisponibles).map(([id, s]) => (
                                            <option key={id} value={id}>{s.nombre} - ${s.precio}</option>
                                        ))}
                                    </select>
                                 </div>
                            </FormInput>
                        </div>

                        {/* Columna Derecha */}
                        <div>
                             <FormInput id="fecha" label="3. Fecha del Turno">
                                 <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaCalendarAlt /></span>
                                     <input type="date" id="fecha" value={fecha} onChange={e => setFecha(e.target.value)} required className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                                 </div>
                            </FormInput>

                            <FormInput id="hora" label="4. Hora del Turno">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><FaClock /></span>
                                    <input type="time" id="hora" value={hora} onChange={e => setHora(e.target.value)} required className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </FormInput>
                        </div>
                    </div>

                     <div className="col-span-1 md:col-span-2 mt-2">
                        <FormInput id="notas" label="5. Notas Adicionales (opcional)">
                            <div className="relative">
                                 <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-500"><FaPen /></span>
                                 <textarea id="notas" value={notas} onChange={e => setNotas(e.target.value)} rows="3" className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ej: Es alérgico al pollo, se pone nervioso con otros perros, etc."></textarea>
                            </div>
                        </FormInput>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button type="submit" disabled={isSubmitting || !fecha || !hora || !servicioId} className="w-full md:w-auto px-12 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Solicitando Turno...' : 'Confirmar Turno'}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
                </form>
            )}
        </div>
    );
}
