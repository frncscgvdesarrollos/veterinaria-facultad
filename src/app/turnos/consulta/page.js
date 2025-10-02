'use client'

import FormularioTurnoConsulta from '@/app/components/FormularioTurnoConsulta';

export default function TurnoConsultaPage({ mascotas, ocupacion }) {

    if (!mascotas || mascotas.length === 0) {
        return (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes mascotas registradas</h2>
                <p className="text-gray-600">Para solicitar un turno, primero debes registrar al menos una mascota en tu perfil.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Turno de Consulta Veterinaria</h1>
                <p className="mt-2 text-lg text-gray-600">Agenda una cita para el cuidado de la salud de tu mascota.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
                <FormularioTurnoConsulta 
                    mascotas={mascotas}
                    ocupacion={ocupacion} 
                />
            </div>
        </div>
    );
}
