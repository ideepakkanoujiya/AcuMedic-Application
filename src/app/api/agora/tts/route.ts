
import { NextResponse } from 'next/server';
import { textToSpeechFlow } from '@/ai/flows/text-to-speech-flow';

export const dynamic = 'force-dynamic'; // Ensures the route is not statically cached

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // The Gemini API key is passed in the header, but our flow uses the backend key.
    // We pass the entire payload to the Genkit flow.
    const result = await textToSpeechFlow(payload);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in Agora TTS proxy API route:', error);
    return NextResponse.json(
        { error: 'An error occurred while processing the TTS request.', details: error.message },
        { status: 500 }
    );
  }
}
