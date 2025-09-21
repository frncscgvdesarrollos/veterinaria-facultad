
'use client';

import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { confirmarTurno, cancelarTurno } from '@/app/admin/actions';

const TurnoActions = ({ turnoId }) => {
    const [loading, setLoading] = useState(null); // null, 'confirm', 'cancel'

    const handleConfirm = async () => {
        if (!confirm('¿Estás seguro de que deseas confirmar este turno?')) return;
        setLoading('confirm');
        try {
            await confirmarTurno(turnoId);
        } catch (error) {
            console.error("Error al confirmar:", error);
            alert("Hubo un error al confirmar el turno.");
        }
        // No es necesario setLoading(null) porque la revalidación recargará el componente.
    };

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return;
        setLoading('cancel');
        try {
            await cancelarTurno(turnoId);
        } catch (error) {
            console.error("Error al cancelar:", error);
            alert("Hubo un error al cancelar el turno.");
        }
    };

    return (
        <div className="mt-4 flex space-x-2">
            <button
                onClick={handleConfirm}
                disabled={!!loading}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
                {loading === 'confirm' ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                <span className="ml-2">Confirmar</span>
            </button>
            <button
                onClick={handleCancel}
                disabled={!!loading}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
                {loading === 'cancel' ? <FiLoader className="animate-spin" /> : <FiXCircle />}
                <span className="ml-2">Cancelar</span>
            </button>
        </div>
    );
};

export default TurnoActions;
