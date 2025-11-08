'use server';

/**
 * @fileOverview Summarizes a medical report using AI.
 *
 * - summarizeMedicalReport - A function that takes a medical report as input and returns a summary.
 * - SummarizeMedicalReportInput - The input type for the summarizeMedicalReport function.
 * - SummarizeMedicalReportOutput - The return type for the summarizeMedicalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalReportInputSchema = z.object({
  reportText: z
    .string()
    .describe('The text content of the medical report to be summarized.'),
});
export type SummarizeMedicalReportInput = z.infer<
  typeof SummarizeMedicalReportInputSchema
>;

const SummarizeMedicalReportOutputSchema = z.object({
  summary: z.string().describe('The summary of the medical report.'),
});
export type SummarizeMedicalReportOutput = z.infer<
  typeof SummarizeMedicalReportOutputSchema
>;

export async function summarizeMedicalReport(
  input: SummarizeMedicalReportInput
): Promise<SummarizeMedicalReportOutput> {
  return summarizeMedicalReportFlow(input);
}

const summarizeMedicalReportPrompt = ai.definePrompt({
  name: 'summarizeMedicalReportPrompt',
  input: {schema: SummarizeMedicalReportInputSchema},
  output: {schema: SummarizeMedicalReportOutputSchema},
  prompt: `You are an expert medical summarizer. Please summarize the following medical report:

  Report:
  {{reportText}}
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
