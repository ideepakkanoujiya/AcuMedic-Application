'use client';

import { useState, useEffect, useCallback, use } from 'react';
import AgoraUIKit from 'agora-react-uikit';
import { notFound, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { VideoCallChat } from '@/components/video/chat';

interface VideoCallProps {
  params: Promise<{
    channelName: string;
  }>;
}

export default function VideoCall({ params }: VideoCallProps) {
  const [videoCall, setVideoCall] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { channelName } = use(params);
  
  // Define a stable UID for the user for the duration of the session
  const userUid = 1002; // Use a static non-zero UID for the human user

  // Function to start the AI agent
  const startAgent = useCallback(async () => {
    try {
      const agentUid = 1001; // Assign a unique static UID for the agent
      const res = await fetch('/api/agora/start-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName,
          agentUid: agentUid,
          userUid: userUid
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to start AI agent:", errorData.details || 'Unknown error');
        // Non-blocking, so we don't show an error to the user if the agent fails
      } else {
        console.log("AI Agent started successfully.");
      }
    } catch (e) {
      console.error("Error calling start-agent API:", e);
    }
  }, [channelName, userUid]);


  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchTokenAndStartAgent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/agora/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelName,
            uid: userUid, 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Agora token');
        }
        const data = await response.json();
        setToken(data.token);
        
        // After successfully getting a token, start the agent
        await startAgent();

      } catch (err: any) {
        console.error('Token fetch error:', err);
        setError('Could not connect to the video service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndStartAgent();
  // The dependency array is intentionally kept minimal.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, user, isUserLoading, router, userUid]);

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
    EndCall: () => {
      setVideoCall(false);
      router.push('/dashboard');
    },
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
    <div className="flex h-screen w-screen bg-black">
      <div className="flex-1 relative">
        <AgoraUIKit
          rtcProps={{
            appId: appId,
            channel: channelName,
            token: token,
            role: 'publisher',
            uid: userUid,
          }}
          callbacks={callbacks}
          styleProps={{
            container: { height: '100%', width: '100%', borderRadius: 0, position: 'absolute' },
          }}
        />
      </div>
      <div className="w-[380px] h-full bg-background border-l border-border">
          <VideoCallChat />
      </div>
    </div>
  ) : (
     <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold">Call Ended</h2>
        <button onClick={() => router.push('/dashboard')} className="mt-6">Back to Dashboard</button>
      </div>
  );
}
