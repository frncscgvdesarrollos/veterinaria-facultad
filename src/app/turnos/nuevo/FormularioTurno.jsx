'use client';

import { useState, useMemo } from 'react';
import { FaPaw, FaCut, FaStethoscope, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

// Placeholder para la futura Server Action
// import { crearTurno } from '@/lib/actions/turnos.actions';

const Step = ({ number, label, isCompleted, isActive }) => (
    <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {isCompleted ? <FaCheckCircle /> : number}
        </div>
        <div className={`ml-3 font-semibold ${isActive || isCompleted ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
            {label}
        </div>
        <FaChevronRight className="text-gray-300 mx-4" />
    </div>
);

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
        // Si se cambia de categoría, reseteamos las selecciones posteriores
        if (cat !== categoria) {
            setMascotaId('');
            setServicioId('');
            // Si la nueva categoría es peluquería y la mascota seleccionada era un gato, la deseleccionamos
            const mascotaSeleccionada = mascotas.find(m => m.id === mascotaId);
            if(cat === 'peluqueria' && mascotaSeleccionada?.especie.toLowerCase() === 'gato') {
                setMascotaId('');
            }
        }
        setStep(2);
    };

    const serviciosDisponibles = useMemo(() => {
        if (!categoria) return {};
        return servicios[categoria] || {};
    }, [categoria, servicios]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = {
            userId: user.uid,
            mascotaId,
            servicioId,
            categoria,
            fecha,
            hora,
            notas,
        };

        console.log('Datos del formulario listos para enviar:', formData);
        
        // --- PRÓXIMAMENTE: Llamada a la Server Action ---
        // try {
        //     const result = await crearTurno(formData);
        //     if (result.success) {
        //         // Redirigir o mostrar mensaje de éxito
        //         alert('¡Turno creado exitosamente!');
        //     } else {
        //         setError(result.error || 'No se pudo crear el turno.');
        //     }
        // } catch (err) {
        //     setError('Ocurrió un error inesperado.');
        // } finally {
        //     setIsSubmitting(false);
        // }

        // Placeholder de éxito
        setTimeout(() => {
            alert('Simulación de éxito. ¡Turno solicitado! Revisa la consola para ver los datos.');
            setIsSubmitting(false);
        }, 1000);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: // Seleccionar Categoría
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">¿Qué servicio necesitas?</h2>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button onClick={() => handleCategoriaSelect('clinica')} className="flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-800/60 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 border-2 border-blue-200 dark:border-blue-700">
                                <FaStethoscope className="text-5xl text-blue-500 mb-3" />
                                <span className="text-xl font-semibold text-blue-800 dark:text-blue-200">Clínica Veterinaria</span>
                            </button>
                            <button onClick={() => handleCategoriaSelect('peluqueria')} className="flex flex-col items-center justify-center p-8 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/50 dark:hover:bg-pink-800/60 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 border-2 border-pink-200 dark:border-pink-700">
                                <FaCut className="text-5xl text-pink-500 mb-3" />
                                <span className="text-xl font-semibold text-pink-800 dark:text-pink-200">Peluquería Canina</span>
                            </button>
                        </div>
                    </div>
                );
            case 2: // Seleccionar Mascota y Servicio
                return (
                    <div>
                         <button onClick={() => setStep(1)} className="text-sm text-primary mb-4">← Cambiar categoría</button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* --- Selección de Mascota --- */}
                            <div>
                                <label htmlFor="mascota" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">1. Elige tu mascota</label>
                                <select
                                    id="mascota"
                                    value={mascotaId}
                                    onChange={(e) => setMascotaId(e.target.value)}
                                    className="block w-full p-3 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="" disabled>Selecciona una mascota...</option>
                                    {mascotas.map(m => (
                                        <option key={m.id} value={m.id} disabled={categoria === 'peluqueria' && m.especie.toLowerCase() === 'gato'}>
                                            {m.nombre} ({m.especie}) {categoria === 'peluqueria' && m.especie.toLowerCase() === 'gato' ? '- No disponible' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* --- Selección de Servicio --- */}
                            {mascotaId && (
                                <div>
                                    <label htmlFor="servicio" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">2. Elige el servicio</label>
                                    <select
                                        id="servicio"
                                        value={servicioId}
                                        onChange={(e) => setServicioId(e.target.value)}
                                        className="block w-full p-3 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                                        disabled={!mascotaId}
                                    >
                                        <option value="" disabled>Selecciona un servicio...</option>
                                        {Object.entries(serviciosDisponibles).map(([id, s]) => (
                                            <option key={id} value={id}>{s.nombre} - ${s.precio}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        {servicioId && <button onClick={() => setStep(3)} className="mt-8 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105">Siguiente</button>}
                    </div>
                );
            case 3: // Fecha, Hora y Notas
                return (
                     <div>
                        <button onClick={() => setStep(2)} className="text-sm text-primary mb-4">← Volver</button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="fecha" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">3. Elige la fecha</label>
                                <input type="date" id="fecha" value={fecha} onChange={e => setFecha(e.target.value)} className="block w-full p-3 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="hora" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">4. Elige la hora</label>
                                <input type="time" id="hora" value={hora} onChange={e => setHora(e.target.value)} className="block w-full p-3 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm" />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="notas" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">5. Notas adicionales (opcional)</label>
                             <textarea id="notas" value={notas} onChange={e => setNotas(e.target.value)} rows="4" className="block w-full p-3 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm" placeholder="Alergias, comportamiento, etc."></textarea>
                        </div>

                        <button onClick={handleSubmit} disabled={isSubmitting || !fecha || !hora} className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-opacity disabled:opacity-50">
                            {isSubmitting ? 'Solicitando...' : 'Confirmar Turno'}
                        </button>
                         {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </div>
                )
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
             {/* Barra de Progreso */}
            <div className="flex justify-between items-center mb-10 text-xs md:text-sm">
                <Step number={1} label="Categoría" isActive={step === 1} isCompleted={step > 1} />
                <Step number={2} label="Mascota/Servicio" isActive={step === 2} isCompleted={step > 2} />
                <Step number={3} label="Fecha/Hora" isActive={step === 3} isCompleted={step > 3} />
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${step > 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step > 3 ? <FaCheckCircle /> : 4}
                    </div>
                    <div className={`ml-3 font-semibold ${step > 3 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
                        Confirmar
                    </div>
                </div>
            </div>

            {renderStepContent()}
        </div>
    );
}
