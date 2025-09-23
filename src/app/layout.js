import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import SubHeader from "@/app/components/SubHeader"; // Importamos SubHeader
import { getCurrentUser } from "@/lib/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veterinaria Magalí Martin",
  description: "Gestión de turnos, adopciones y tienda online para tu mascota.",
};

export default async function RootLayout({ children }) {
  // 1. VOLVEMOS A OBTENER EL USUARIO AQUÍ
  const currentUser = await getCurrentUser();

  // 2. RECONSTRUIMOS EL OBJETO userDataForHeader QUE EL HEADER ESPERABA
  const userDataForHeader = currentUser ? {
    isLoggedIn: true,
    // Usamos displayName y photoURL de Firebase Auth
    name: currentUser.displayName || currentUser.email,
    email: currentUser.email,
    photoURL: currentUser.photoURL, // Corregido de 'picture' a 'photoURL'
    role: currentUser.role || null,
  } : {
    isLoggedIn: false,
  };

  return (
    <html lang="es" className={inter.className}>
      <body className={`bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider>
          {/* 3. PASAMOS LAS PROPS RESTAURADAS AL HEADER */}
          <Header userData={userDataForHeader} />
          {/* 4. AÑADIMOS EL SUBHEADER GLOBALMENTE */}
          <SubHeader />
          <main className="flex-grow w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
