'use server';

/**
 * @fileOverview Generates a pre-consultation briefing for a doctor about a patient.
 *
 * - generateDoctorBriefing - A function that takes a patient ID and returns an AI-generated briefing.
 * - DoctorBriefingInput - The input type for the function.
 * - DoctorBriefingOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DoctorBriefingInputSchema = z.object({
  patientId: z.string().describe("The unique identifier for the patient."),
});
export type DoctorBriefingInput = z.infer<typeof DoctorBriefingInputSchema>;

const DoctorBriefingOutputSchema = z.object({
  primaryConcernSummary: z.string().describe("A one-sentence summary of the patient's primary reason for the visit."),
  keyInvestigationAreas: z.array(z.string()).describe("A bulleted list of 2-3 key areas or questions the doctor should focus on during the consultation."),
  relevantHistory: z.array(z.string()).describe("A bulleted list of relevant alerts from the patient's history, such as high-risk factors or recent critical symptom checks."),
});
export type DoctorBriefingOutput = z.infer<typeof DoctorBriefingOutputSchema>;

export async function generateDoctorBriefing(input: DoctorBriefingInput): Promise<DoctorBriefingOutput> {
  // In a real app, you would fetch patient data from Firestore using the patientId.
  // For this demo, we'll use mock data.
  const mockPatientData = {
    symptomCheck: {
        symptoms: "Patient reports chest pain, shortness of breath, and a tingling sensation in the left arm.",
        emergencyLevel: "urgent",
        recommendedSpecialty: "Cardiologist",
    },
    riskAssessment: {
        riskScores: [{ condition: "Heart Disease", level: "high", percentage: 25 }],
        keyFactors: [{ factor: "High BMI" }, { factor: "Smoking" }],
    },
  };

  return generateDoctorBriefingFlow(mockPatientData);
}

const briefingPrompt = ai.definePrompt({
  name: 'generateDoctorBriefingPrompt',
  input: { schema: z.any() }, // Using any for mock data shape
  output: { schema: DoctorBriefingOutputSchema },
  prompt: `You are a clinical assistant AI. Your task is to provide a concise pre-consultation briefing for a doctor based on the patient's self-reported data. Be direct and use clinical language.

Patient Data:
- Last Symptom Check: "{{symptomCheck.symptoms}}" (Assessed as {{symptomCheck.emergencyLevel}})
- Risk Profile: Known risk factors include {{#each riskAssessment.keyFactors}}{{factor}}{{/each}}. 10-year risk for {{riskAssessment.riskScores.0.condition}} is {{riskAssessment.riskScores.0.level}} ({{riskAssessment.riskScores.0.percentage}}%).

Based on this, generate a briefing with:
1.  A one-sentence summary of the primary concern.
2.  2-3 key areas for investigation.
3.  A list of relevant alerts from their history.
`,
});

const generateDoctorBriefingFlow = ai.defineFlow(
  {
    name: 'generateDoctorBriefingFlow',
    inputSchema: z.any(),
    outputSchema: DoctorBriefingOutputSchema,
  },
  async (patientData) => {
    const { output } = await briefingPrompt(patientData);
    return output!;
  }
);
