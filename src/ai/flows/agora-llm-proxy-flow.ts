'use server';

/**
 * @fileOverview A proxy flow to adapt Agora's OpenAI-style LLM requests for Genkit and Gemini.
 *
 * - agoraLlmProxyFlow - A flow that translates requests and responses between Agora and Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for incoming messages from Agora (OpenAI format)
const OpenAiMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

// Define the input schema for the flow, matching Agora's request body
const AgoraLlmInputSchema = z.object({
  model: z.string().optional(),
  messages: z.array(OpenAiMessageSchema),
  // Include other potential fields from Agora if needed, though we only use messages
});

export const agoraLlmProxyFlow = ai.defineFlow(
  {
    name: 'agoraLlmProxyFlow',
    inputSchema: AgoraLlmInputSchema,
    outputSchema: z.any(), // We will manually construct the OpenAI-compatible response
  },
  async (payload) => {
    // The history is the set of messages from Agora.
    const history = payload.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        content: [{ text: msg.content }],
    }));

    // Generate content using the Gemini model with the provided history.
    const result = await ai.generate({
      // You can specify a model here or use the default from genkit.ts
      // model: 'googleai/gemini-2.5-flash', 
      history: history,
      prompt: '', // The last message in history is the prompt
    });

    const responseText = result.text;
    
    // Construct a response that mimics the OpenAI ChatCompletion format,
    // as this is what the Agora AI Agent expects.
    const openAiCompatibleResponse = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'gemini-via-genkit-proxy',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseText,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: result.usage?.inputTokens || 0,
        completion_tokens: result.usage?.outputTokens || 0,
        total_tokens: result.usage?.totalTokens || 0,
      },
    };
    
    return openAiCompatibleResponse;
  }
);
