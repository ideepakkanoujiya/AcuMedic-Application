'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

interface UseAuthRedirectOptions {
  redirectOn: 'auth' | 'no-auth';
  redirectTo: string;
}

export function useAuthRedirect({ redirectOn, redirectTo }: UseAuthRedirectOptions) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }

    const shouldRedirect = (redirectOn === 'auth' && user) || (redirectOn === 'no-auth' && !user);

    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [user, isUserLoading, router, redirectOn, redirectTo]);

  // Return loading state so the calling component can show a spinner
  return isUserLoading || (redirectOn === 'auth' && user) || (redirectOn === 'no-auth' && !user);
}
