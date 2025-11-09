'use server';

/**
 * @fileOverview Summarizes a medical report using AI, converting jargon into simple, understandable language.
 *
 * - summarizeMedicalReport - A function that takes a medical report as input and returns a simplified summary.
 * - SummarizeMedicalReportInput - The input type for the summarizeMedicalReport function.
 * - SummarizeMedicalReportOutput - The return type for the summarizeMedicalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalReportInputSchema = z.object({
  reportText: z
    .string()
    .describe('The full text content of the medical report to be summarized.'),
  reportImage: z
    .string()
    .optional()
    .describe(
      "An image of the medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The AI will perform OCR on this image."
    ),
});
export type SummarizeMedicalReportInput = z.infer<
  typeof SummarizeMedicalReportInputSchema
>;

const SummarizeMedicalReportOutputSchema = z.object({
  simplifiedSummary: z.string().describe('A simple, clear summary of the key findings in the report, written in plain, non-medical language.'),
  keyTakeaways: z.array(z.string()).describe('A bulleted list of the 3-5 most important points or results from the report.'),
  nextSteps: z.string().describe('A short, encouraging suggestion for what the patient should do next (e.g., "Discuss these results with your doctor.").'),
});
export type SummarizeMedicalReportOutput = z.infer<
  typeof SummarizeMedicalReportOutputSchema
>;

export async function summarizeMedicalReport(
  input: SummarizeMedicalReportInput
): Promise<SummarizeMedicalReportOutput> {
  if (!input.reportText && !input.reportImage) {
    throw new Error('Either report text or an image must be provided.');
  }
  return summarizeMedicalReportFlow(input);
}

const summarizeMedicalReportPrompt = ai.definePrompt({
  name: 'summarizeMedicalReportPrompt',
  input: {schema: SummarizeMedicalReportInputSchema},
  output: {schema: SummarizeMedicalReportOutputSchema},
  prompt: `You are an expert medical communicator with OCR capabilities. Your task is to read a complex medical report—either from text or an image—and translate it into simple, easy-to-understand language for a patient. Avoid all medical jargon.

  **Instructions:**
  1.  **Analyze the Input**: Prioritize the image if provided; otherwise, use the text. Perform OCR on the image to extract the report content.
  2.  **Simplify the Findings**: Generate a 'simplifiedSummary' that explains the key results clearly.
  3.  **Extract Key Points**: Identify the 3-5 most critical 'keyTakeaways' and list them as bullet points.
  4.  **Suggest Next Steps**: Provide a gentle and clear recommendation for the 'nextSteps'.

  {{#if reportImage}}
  **Medical Report Image:**
  {{media url=reportImage}}
  {{else}}
  **Medical Report Text:**
  {{{reportText}}}
  {{/if}}
  `,
});

const summarizeMedicalReportFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalReportFlow',
    inputSchema: SummarizeMedicalReportInputSchema,
    outputSchema: SummarizeMedicalReportOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalReportPrompt(input);
    return output!;
  }
);
