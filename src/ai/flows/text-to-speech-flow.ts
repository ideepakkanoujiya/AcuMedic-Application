'use server';

/**
 * @fileOverview A flow to convert text to speech using Gemini.
 *
 * - textToSpeechFlow - A function that takes text and returns audio data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// The Agora agent sends a different payload format, so we need a specific schema.
const AgoraTtsInputSchema = z.object({
    text: z.string(),
    voice: z.string().optional(),
    response_id: z.string(),
});

export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: AgoraTtsInputSchema,
    outputSchema: z.any(),
  },
  async (payload) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: payload.text,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from TTS model.');
    }
    
    // Convert base64 data URI to Buffer
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    // Convert PCM to WAV and then to base64
    const wavBase64 = await toWav(audioBuffer);

    // Agora agent expects a specific JSON structure with the audio data.
    return {
      audio: {
        content: wavBase64,
        content_type: 'audio/wav',
      },
      response_id: payload.response_id,
    };
  }
);
