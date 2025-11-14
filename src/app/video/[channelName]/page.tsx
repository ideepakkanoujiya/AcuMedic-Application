'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { notFound, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

// Dynamically import AgoraUIKit with SSR turned off
const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading Video Component...</p>
    </div>
  ),
});


interface VideoCallProps {
  params: {
    channelName: string;
  };
}

export default function VideoCall({ params }: VideoCallProps) {
  const [videoCall, setVideoCall] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { channelName } = params;
  
  // Using a static numeric UID for simplicity. In a real app, this would be dynamic and unique.
  const userUid = 1002;
  
  const handleEndCall = useCallback(() => {
    setVideoCall(false);
    router.push('/dashboard');
  }, [router]);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchTokenAndStartAgent = async () => {
      try {
        setLoading(true);
        const tokenResponse = await fetch('/api/agora/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelName,
            uid: userUid,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch Agora token');
        }
        const tokenData = await tokenResponse.json();
        setToken(tokenData.token);
        
      } catch (err: any) {
        console.error('Initialization error:', err);
        setError('Could not connect to the video service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndStartAgent();
  }, [channelName, user, isUserLoading, router]);

  if (isUserLoading || loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Connecting to video session...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Connection Failed</h2>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <button onClick={() => router.back()} className="mt-6">Go Back</button>
      </div>
    );
  }
  
  if (!channelName) {
      notFound();
  }

  const callbacks = {
    EndCall: handleEndCall,
  };

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  if (!appId || !token) {
    return (
       <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Configuration Error</h2>
        <p className="mt-2 text-muted-foreground">The application is not configured correctly for video calls.</p>
      </div>
    );
  }

  return videoCall ? (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <AgoraUIKit
        rtcProps={{
          appId: appId,
          channel: channelName,
          token: token,
          role: 'host',
          uid: userUid,
        }}
        rtmProps={{
          token: token,
          uid: userUid.toString(),
        }}
        callbacks={callbacks}
      />
    </div>
  ) : (
     <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold">Call Ended</h2>
        <button onClick={() => router.push('/dashboard')} className="mt-6">Back to Dashboard</button>
      </div>
  );
}
