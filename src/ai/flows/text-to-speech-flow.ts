'use server';

/**
 * @fileOverview A flow to convert text to speech using Gemini's TTS model.
 * This flow is designed to be called by the Agora AI Agent.
 *
 * - textToSpeechFlow - A function that takes text and returns audio data from Gemini.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

// The Agora agent sends a specific payload format.
const AgoraTtsInputSchema = z.object({
    text: z.string(),
    voice: z.string().optional(), // Voice ID can be passed from Agora if needed
    response_id: z.string(),
});

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

    let bufs = [] as any[];
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

export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: AgoraTtsInputSchema,
    outputSchema: z.any(),
  },
  async (payload) => {
    try {
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

        if (!media) {
            throw new Error('No audio media returned from Gemini TTS.');
        }

        // The media URL is a data URI: "data:audio/pcm;base64,<data>"
        const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
        const pcmBuffer = Buffer.from(pcmBase64, 'base64');
        
        // Convert PCM to WAV for Agora
        const wavBase64 = await toWav(pcmBuffer);

        return {
            audio: {
                content: wavBase64,
                content_type: 'audio/wav',
            },
            response_id: payload.response_id,
        };

    } catch (error) {
      console.error("Error in textToSpeechFlow (Gemini TTS):", error);
      throw new Error('Failed to generate speech with Gemini TTS.');
    }
  }
);
