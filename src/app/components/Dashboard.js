import Link from 'next/link';
import GaleriaAdopciones from './GaleriaAdopciones';
import VistaTienda from './VistaTienda';

export default function Dashboard() {
  return (
    <main 
      className="flex-grow bg-cover bg-center"
      style={{ backgroundImage: "url('/patron1.jpg')" }}
    >
      <div className="bg-white bg-opacity-75 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* ========= SECCIÓN DE TURNOS (CLIENTE) ========= */}
          <section className="text-center mb-20 md:mb-28">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                  <Link 
                      href="/turnos/consulta" 
                      className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 px-10 rounded-xl text-lg uppercase tracking-wider transition-transform transform hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-violet-300"
                  >
                      Pedir Turno Consulta
                  </Link>
                  <Link 
                      href="/turnos/peluqueria" 
                      className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-bold py-5 px-10 rounded-xl text-lg uppercase tracking-wider transition-transform transform hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-300"
                  >
                      Pedir Turno Peluquería
                  </Link>
              </div>
          </section>

          {/* ========= SECCIÓN DE ADOPCIONES (SERVIDOR) ========= */}
          {/* @ts-ignore -> https://github.com/vercel/next.js/issues/42292 */}
          <GaleriaAdopciones />

          {/* ========= SECCIÓN DE TIENDA (CLIENTE) ========= */}
          <VistaTienda />
        </div>
      </div>
    </main>
  );
}
