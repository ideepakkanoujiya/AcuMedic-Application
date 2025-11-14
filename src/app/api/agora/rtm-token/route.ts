import { NextResponse } from 'next/server';
import { RtmTokenBuilder, RtmRole } from 'agora-token';

export async function POST(request: Request) {
  const { uid } = await request.json();

  if (!uid) {
    return NextResponse.json({ error: 'uid is required' }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    console.error('Missing Agora env variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      uid,
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating RTM token:', error);
    return NextResponse.json({ error: 'Failed to generate RTM token' }, { status: 500 });
  }
}
