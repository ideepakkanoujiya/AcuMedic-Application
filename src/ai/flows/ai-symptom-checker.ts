// This file implements the AI Symptom Checker flow, allowing users to input symptoms in multiple languages and receive triage information.
'use server';

/**
 * @fileOverview AI Symptom Checker flow. Allows users to input symptoms in multiple languages and receive triage information.
 *
 * - aiSymptomChecker - A function that handles the symptom checking process.
 * - AISymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AISymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the patient in English, Hindi, or Hinglish.'),
  language: z
    .string()
    .optional()
    .describe('The language in which the symptoms are described (e.g., English, Hindi).'),
  voiceInput: z.string().optional().describe('Voice input of the symptoms.'),
  image: z
    .string()
    .optional()
    .describe(
      "An optional image related to the symptoms, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Example: a photo of a rash."
    ),
});
export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  emergencyLevel: z
    .string()
    .describe('The emergency level of the condition (normal / urgent / critical).'),
  possibleConditions: z.array(z.string()).describe('A list of possible medical conditions.'),
  recommendedSpecialty: z.string().describe('The recommended medical specialty (ICD-10 based mapping).'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI medical triage assistant. A patient will describe their symptoms, and you will determine the emergency level, possible conditions, and recommended medical specialty.

Symptoms: {{{symptoms}}}

{{#if language}}Language: {{{language}}}{{/if}}
{{#if voiceInput}}Voice Input: {{{voiceInput}}}{{/if}}
{{#if image}}
Analyze the following image in conjunction with the symptoms.
Image: {{media url=image}}
{{else}}
Analyze the symptoms provided.
{{/if}}

Respond with the emergency level (normal, urgent, or critical), a list of possible conditions, and the recommended medical specialty.
`,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
