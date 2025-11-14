'use server';

/**
 * @fileOverview A flow to convert text to speech using Murf AI.
 * This flow is designed to be called by the Agora AI Agent.
 *
 * - textToSpeechFlow - A function that takes text and returns audio data from Murf AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// The Agora agent sends a specific payload format.
const AgoraTtsInputSchema = z.object({
    text: z.string(),
    voice: z.string().optional(), // Voice ID can be passed from Agora if needed
    response_id: z.string(),
});

export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: AgoraTtsInputSchema,
    outputSchema: z.any(),
  },
  async (payload) => {
    const murfApiKey = process.env.MURFAI_API_KEY;
    if (!murfApiKey) {
      throw new Error('Murf AI API key is not configured.');
    }

    // Default voice ID for Murf AI, can be overridden by payload.voice
    const voiceId = payload.voice || 'murf-voice-id-placeholder'; 

    try {
      const response = await fetch('https://api.murf.ai/v1/speech:synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': murfApiKey,
        },
        body: JSON.stringify({
          text: payload.text,
          voice: voiceId,
          format: 'wav', // Request WAV format
          sampleRate: 24000, // Agora recommends 16000, 24000, or 48000
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Murf AI API error:', errorBody);
        throw new Error(`Murf AI API request failed with status ${response.status}`);
      }

      // Murf AI returns the audio data directly as a buffer.
      const audioBuffer = await response.arrayBuffer();
      const wavBase64 = Buffer.from(audioBuffer).toString('base64');
      
      // Agora agent expects a specific JSON structure with the audio data.
      return {
        audio: {
          content: wavBase64,
          content_type: 'audio/wav',
        },
        response_id: payload.response_id,
      };

    } catch (error) {
      console.error("Error in textToSpeechFlow (Murf AI):", error);
      // It's important to still return a valid structure for Agora, even on failure.
      // Returning an error will cause Agora to play its own failure message.
      throw new Error('Failed to generate speech with Murf AI.');
    }
  }
);
