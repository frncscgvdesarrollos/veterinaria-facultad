'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veterinaria Magalí Martin",
  description: "Gestión de turnos, adopciones y tienda online para tu mascota.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <body className={`bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
