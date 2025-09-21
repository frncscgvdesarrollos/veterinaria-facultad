'use client';

import PrivateRoute from "@/app/components/PrivateRoute";
import Footer from "@/app/components/Footer";

export default function MisTurnosPage() {
  return (
    <PrivateRoute>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Mis Turnos</h1>
        {/* Aquí se mostrará la lista de turnos del usuario */}
      </main>
      <Footer />
    </PrivateRoute>
  );
}
