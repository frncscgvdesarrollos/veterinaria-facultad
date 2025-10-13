"use client"

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`bg-background text-foreground flex flex-col min-h-screen`}>
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
