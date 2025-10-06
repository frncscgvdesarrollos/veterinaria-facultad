'use client';

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
    
      if (typeof window !== "undefined") {
        try {
          const db = getFirestore(app);
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
    }, 5000); 

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
