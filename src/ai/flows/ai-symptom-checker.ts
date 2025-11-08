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
  detailedAnalysis: z.string().describe('A detailed analysis of the symptoms, explaining the reasoning behind the triage assessment and potential conditions in a clear, easy-to-understand paragraph.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI medical triage assistant. Your role is to analyze a patient's symptoms and provide a preliminary assessment.

Patient Symptoms: {{{symptoms}}}

{{#if language}}Language: {{{language}}}{{/if}}
{{#if voiceInput}}Voice Input: {{{voiceInput}}}{{/if}}
{{#if image}}
Also analyze the following image in conjunction with the symptoms.
Image: {{media url=image}}
{{/if}}

Based on the information provided, perform the following tasks:
1.  **Determine the Emergency Level:** Classify the situation as 'normal', 'urgent', or 'critical'.
2.  **Identify Possible Conditions:** List a few potential medical conditions that could be causing these symptoms.
3.  **Recommend a Medical Specialty:** Suggest the most appropriate medical specialty for the patient to consult (e.g., Cardiologist, Dermatologist).
4.  **Provide a Detailed Analysis:** Write a clear, easy-to-understand paragraph that explains your reasoning for the emergency level and recommended specialty. Summarize what the analysis indicates in a helpful way for the user.

Your response must be in the structured format defined by the output schema.
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
