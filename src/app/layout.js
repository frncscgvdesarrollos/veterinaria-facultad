import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import SubHeader from "@/app/components/SubHeader"; // 1. IMPORTAMOS EL SUBHEADER

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veterinaria Magalí Martin",
  description: "Gestión de turnos, adopciones y tienda online para tu mascota.",
};

export default function RootLayout({ children }) {
  // Ya no necesitamos pasar props manualmente al Header, el AuthContext se encarga de todo.
  return (
    <html lang="es" className={inter.className}>
      <body className={`bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          {/* 2. AÑADIMOS EL SUBHEADER DEBAJO DEL HEADER */}
          <SubHeader />
          <main className="flex-grow w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
