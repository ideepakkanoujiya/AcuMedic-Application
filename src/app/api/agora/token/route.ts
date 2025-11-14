'use client';
import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

export async function POST(request: Request) {
  const { channelName, uid } = await request.json();

  if (!channelName || !uid) {
    return NextResponse.json({ error: 'channelName and uid are required' }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    console.error('Agora App ID or Certificate is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    // UID can be a string or a number for RTC token builder
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid, // UID is now a string from the client
      role,
      privilegeExpiredTs
    );
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
