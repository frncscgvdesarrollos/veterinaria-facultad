'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"] });

// METADATA SE MANTIENE IGUAL
export const metadata = {
  title: "Veterinaria MagalÃ­ Martin",
  description: "GestiÃ³n de turnos, adopciones y tienda online para tu mascota.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <body className={`bg-gray-50 flex flex-col min-h-screen`}>
        {/* AuthProvider ahora envuelve toda la aplicaciÃ³n,
            incluyendo el Header y el resto del contenido. */}
        <AuthProvider>
          {/* El Header ya no necesita props. ObtendrÃ¡ todo del AuthContext */}
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
