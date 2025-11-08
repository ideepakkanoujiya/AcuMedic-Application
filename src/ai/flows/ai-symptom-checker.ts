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
    .describe('The symptoms or question described by the patient in English, Hindi, or Hinglish.'),
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
  emergencyLevel: z.enum(['normal', 'urgent', 'critical']).describe("Classify the situation as 'normal', 'urgent', or 'critical'."),
  possibleConditions: z.array(z.string()).describe('A list of a few potential medical conditions that could be causing these symptoms.'),
  recommendedSpecialty: z.string().describe('The most appropriate medical specialty for the patient to consult (e.g., Cardiologist, Dermatologist).'),
  detailedAnalysis: z.string().describe('A clear, easy-to-understand paragraph that explains your reasoning for the emergency level and recommended specialty.'),
  response: z.string().describe('A detailed, conversational response to the user query that includes all the above information.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are a conversational AI Health Assistant named AcuMedic. Your role is to analyze a patient's symptoms or answer any health-related questions they have.

If the user describes symptoms, perform the following tasks and populate the output schema accordingly:
1.  **Determine the Emergency Level:** Classify the situation as 'normal', 'urgent', or 'critical'.
2.  **Identify Possible Conditions:** List a few potential medical conditions that could be causing these symptoms.
3.  **Recommend a Medical Specialty:** Suggest the most appropriate medical specialty for the patient to consult (e.g., Cardiologist, Dermatologist).
4.  **Provide a Detailed Analysis:** Write a clear, easy-to-understand paragraph that explains your reasoning for the emergency level and recommended specialty.
5.  **Generate a Conversational Response:** Combine all the above information into a supportive and professional conversational response. Start your first response with a greeting.

If the user asks a general question, provide a clear, helpful, and conversational answer in the 'response' field. For general questions, you can set 'emergencyLevel' to 'normal' and other fields to reasonable defaults (e.g., empty arrays or 'N/A').

Patient Query: {{{symptoms}}}

{{#if language}}Language: {{{language}}}{{/if}}
{{#if voiceInput}}Voice Input: {{{voiceInput}}}{{/if}}
{{#if image}}
Also analyze the following image in conjunction with the query.
Image: {{media url=image}}
{{/if}}

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
