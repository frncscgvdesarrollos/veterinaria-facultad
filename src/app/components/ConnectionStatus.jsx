'use client';

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      // Asegúrate de que este código solo se ejecute en el lado del cliente
      if (typeof window !== "undefined") {
        try {
          const db = getFirestore(app);
          // Intentamos leer un documento que no existe para verificar la conexión.
          // Esto es una operación de bajo costo que no consume lecturas si el documento no se encuentra.
          const docRef = doc(db, "_connection_test", "_doc");
          await getDoc(docRef);
          setIsConnected(true);
        } catch (error) {
          setIsConnected(false);
        }
      }
    };

    const interval = setInterval(() => {
      checkConnection();
    }, 5000); // Verificamos la conexión cada 5 segundos

    // Verificación inicial
    checkConnection();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 text-xs text-white py-1 px-3 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
      {isConnected ? 'Online' : 'Offline'}
    </div>
  );
};

export default ConnectionStatus;
