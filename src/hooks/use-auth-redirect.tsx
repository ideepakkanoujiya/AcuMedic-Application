'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UseAuthRedirectOptions {
  redirectOn: 'auth' | 'no-auth';
  redirectTo?: string; // Made optional
  doctorRedirectTo?: string;
  patientRedirectTo?: string;
}

export function useAuthRedirect({ redirectOn, redirectTo, doctorRedirectTo, patientRedirectTo }: UseAuthRedirectOptions) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }

    const performRedirect = async () => {
      if (redirectOn === 'auth' && user) {
        let finalRedirectTo = redirectTo;

        if (doctorRedirectTo && patientRedirectTo) {
          try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.role === 'doctor') {
                finalRedirectTo = doctorRedirectTo;
              } else {
                finalRedirectTo = patientRedirectTo;
              }
            } else {
              // Default to patient if doc doesn't exist yet
              finalRedirectTo = patientRedirectTo;
            }
          } catch (error) {
            console.error("Error fetching user role, defaulting to patient redirect:", error);
            finalRedirectTo = patientRedirectTo;
          }
        }
        
        if (finalRedirectTo) {
          router.push(finalRedirectTo);
        } else {
          setIsRedirecting(false);
        }
        
      } else if (redirectOn === 'no-auth' && !user) {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          setIsRedirecting(false);
        }
      } else {
        setIsRedirecting(false);
      }
    };

    performRedirect();

  }, [user, isUserLoading, router, redirectOn, redirectTo, firestore, doctorRedirectTo, patientRedirectTo]);

  // Return a loading state that reflects both user loading and the redirection decision
  return isUserLoading || isRedirecting;
}
