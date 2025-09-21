
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer'; // Importamos el Footer
import ConnectionStatus from '@/app/components/ConnectionStatus';
import './globals.css';

export const metadata = {
  title: 'Veterinaria',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className="bg-violet-200 flex flex-col min-h-screen">
        <AuthProvider> {/*CONTEXTO AUTH*/}
            <Header />
            <main className="flex-grow"> {/* Hacemos que el contenido principal crezca */}
                {children}
            </main>
            <ConnectionStatus />
            <Footer /> {/* Añadimos el Footer al final del body */}
        </AuthProvider>
      </body>
    </html>
  );
}
