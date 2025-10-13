
import FormularioNuevoTurno from "@/app/components/FormularioNuevoTurno";

export default function NuevoTurnoPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Solicitar un nuevo turno
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Elige tu mascota y el motivo de la consulta.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
                    <FormularioNuevoTurno />
                </div>
            </div>
        </div>
    );
}
