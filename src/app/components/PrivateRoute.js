'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (loading) return;


    if (!user) {
      if (pathname !== '/login') {
        router.push('/login');
      }

      setCheckingProfile(false);
      return;
    }

    const checkUserProfile = async () => {
      try {

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        

        if (userDoc.exists() && userDoc.data().profileCompleted) {
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
          if (pathname !== '/completar-perfil') {
            router.push('/completar-perfil');
          }
        }
      } catch (error) {
        console.error("Error al verificar el perfil:", error);

        setIsProfileComplete(false);
        if (pathname !== '/completar-perfil') {
          router.push('/completar-perfil');
        }
      } finally {
        setCheckingProfile(false);
      }
    };

    checkUserProfile();

  }, [user, loading, router, pathname]);

  
  if (loading || checkingProfile) {
    return <div>Cargando...</div>; 
  }

  
  if (!user && pathname === '/login'){
    return children;
  }


  if (isProfileComplete) {
    return children;
  }
  
  
  if (!isProfileComplete && pathname === '/completar-perfil') {
    return children;
  }

 
  return null;
}
