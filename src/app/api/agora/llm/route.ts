
import { NextResponse } from 'next/server';
import { agoraLlmProxyFlow } from '@/ai/flows/agora-llm-proxy-flow';

export const dynamic = 'force-dynamic'; // Ensures the route is not statically cached

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // The Gemini API key is passed in the header by Agora, but our flow is configured
    // on the backend with the key directly, so we don't need to extract it here.
    // We just need to pass the main payload to our Genkit flow.
    const result = await agoraLlmProxyFlow(payload);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in Agora LLM proxy API route:', error);
    return NextResponse.json(
        { error: 'An error occurred while processing the LLM request.', details: error.message },
        { status: 500 }
    );
  }
}
