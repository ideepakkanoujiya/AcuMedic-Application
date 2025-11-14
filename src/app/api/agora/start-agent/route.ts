
import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

// This function is the main handler for the POST request
export async function POST(request: Request) {
  const { channelName, agentUid, userUid } = await request.json();

  // Validate input
  if (!channelName || !agentUid || userUid === undefined || userUid === null) {
    return NextResponse.json({ error: 'channelName, agentUid, and userUid are required' }, { status: 400 });
  }

  // Retrieve Agora credentials from environment variables
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const customerId = process.env.AGORA_CUSTOMER_ID;
  const customerSecret = process.env.AGORA_CUSTOMER_SECRET;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Check if all required environment variables are set
  if (!appId || !appCertificate || !customerId || !customerSecret || !geminiApiKey || !baseUrl || customerId === 'YOUR_AGORA_CUSTOMER_ID' || customerSecret === 'YOUR_AGORA_CUSTOMER_SECRET') {
    console.error('One or more required environment variables for Agora AI Agent are not set.');
    return NextResponse.json({ error: 'Server configuration error for AI agent.' }, { status: 500 });
  }

  // Generate Agora RTC token for the AI agent
  const agentToken = generateRtcToken(appId, appCertificate, channelName, agentUid);

  // Encode credentials for Basic Authentication
  const credentials = `${customerId}:${customerSecret}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  // Define the request body for Agora's AI Agent API
  const agentRequestBody = {
    "name": `agent_${channelName}_${Date.now()}`,
    "properties": {
        "channel": channelName,
        "token": agentToken,
        "agent_rtc_uid": agentUid,
        "remote_rtc_uids": [userUid],
        "idle_timeout": "120",
        "llm": {
            "vendor": "custom",
            "url": `${baseUrl}/api/agora/llm`,
            "api_key": geminiApiKey, 
            "system_messages": [
                {
                    "role": "system",
                    "content": "You are a helpful medical assistant in a live consultation between a doctor and a patient. Be concise and clear."
                }
            ],
            "max_history": 32,
            "greeting_message": "Hello, I am the AcuMedic AI assistant. I will be monitoring this call to provide help if needed.",
            "failure_message": "I'm sorry, I'm having trouble connecting. Please hold on.",
        },
        "tts": {
            "vendor": "custom",
            "url": `${baseUrl}/api/agora/tts`,
            "api_key": geminiApiKey,
        },
        "asr": {
            "language": "en-US"
        }
    }
  };

  try {
    // Make the API call to Agora to start the agent
    const response = await fetch(`https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentRequestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
        console.error('Failed to start Agora AI agent:', responseData);
        return NextResponse.json({ error: 'Failed to start AI agent', details: responseData }, { status: response.status });
    }

    return NextResponse.json({ success: true, agentId: responseData.agent_id });

  } catch (error) {
    console.error('Error starting Agora AI agent:', error);
    return NextResponse.json({ error: 'Internal server error while starting AI agent.' }, { status: 500 });
  }
}

// Helper function to generate an RTC token
function generateRtcToken(appId: string, appCertificate: string, channelName: string, uid: number | string): string {
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // The UID for token generation must be a number
    const numericUid = typeof uid === 'string' ? parseInt(uid, 10) : uid;
    
    // Ensure the UID is a valid integer before building the token
    if (isNaN(numericUid)) {
        throw new Error("Invalid UID for token generation");
    }

    return RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      role,
      privilegeExpiredTs
    );
}
