'use server';

/**
 * @fileOverview Predictive Health Risk Modeler flow.
 * Analyzes user health data to predict long-term risk for chronic diseases.
 *
 * - predictHealthRisk - A function that handles the health risk prediction.
 * - PredictiveHealthRiskInput - The input type for the function.
 * - PredictiveHealthRiskOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveHealthRiskInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the user.'),
  bmi: z.number().describe('The Body Mass Index (BMI) of the user.'),
  bloodPressure: z.object({
    systolic: z.number().describe('Systolic blood pressure (e.g., 120).'),
    diastolic: z.number().describe('Diastolic blood pressure (e.g., 80).'),
  }),
  cholesterol: z.object({
    total: z.number().describe('Total cholesterol level (e.g., 200).'),
    hdl: z.number().describe('HDL (good) cholesterol level (e.g., 50).'),
  }),
  hasDiabetes: z.boolean().describe('Whether the user has a history of diabetes.'),
  isSmoker: z.boolean().describe('Whether the user is currently a smoker.'),
  weeklyExercise: z.number().describe('Minutes of moderate exercise per week.'),
});
export type PredictiveHealthRiskInput = z.infer<typeof PredictiveHealthRiskInputSchema>;

const PredictiveHealthRiskOutputSchema = z.object({
  riskScores: z.array(
    z.object({
      condition: z.string().describe('The chronic disease being assessed (e.g., Heart Disease, Type 2 Diabetes, Stroke).'),
      percentage: z.number().describe('The predicted 10-year risk percentage for this condition (0-100).'),
      level: z.enum(['low', 'moderate', 'high', 'very-high']).describe('The categorized risk level.'),
    })
  ),
  keyFactors: z.array(
    z.object({
      factor: z.string().describe('The key factor influencing the risk (e.g., High BMI, Smoking).'),
      impact: z.string().describe('A brief explanation of how this factor impacts the risk.'),
    })
  ),
  recommendations: z.array(
    z.object({
      area: z.string().describe('The area for improvement (e.g., Diet, Exercise, Lifestyle).'),
      suggestion: z.string().describe('A concrete, actionable recommendation for the user.'),
    })
  ),
  overallSummary: z.string().describe('A brief, encouraging summary of the user\'s health profile and next steps.'),
});
export type PredictiveHealthRiskOutput = z.infer<typeof PredictiveHealthRiskOutputSchema>;

export async function predictHealthRisk(input: PredictiveHealthRiskInput): Promise<PredictiveHealthRiskOutput> {
  return predictHealthRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictHealthRiskPrompt',
  input: { schema: PredictiveHealthRiskInputSchema },
  output: { schema: PredictiveHealthRiskOutputSchema },
  prompt: `You are a sophisticated AI health risk modeling engine. Based on the following user data, act as a cardiologist and endocrinologist to calculate the 10-year risk percentages for developing Heart Disease, Type 2 Diabetes, and Stroke.

User Data:
- Age: {{age}} years
- Gender: {{gender}}
- BMI: {{bmi}}
- Blood Pressure: {{bloodPressure.systolic}}/{{bloodPressure.diastolic}}
- Cholesterol: Total {{cholesterol.total}}, HDL {{cholesterol.hdl}}
- History of Diabetes: {{#if hasDiabetes}}Yes{{else}}No{{/if}}
- Smoker: {{#if isSmoker}}Yes{{else}}No{{/if}}
- Weekly Exercise: {{weeklyExercise}} minutes

Your Task:
1.  **Calculate Risk Scores**: For Heart Disease, Type 2 Diabetes, and Stroke, provide a specific 10-year risk percentage. Classify each risk as 'low', 'moderate', 'high', or 'very-high'. Use established medical risk models like the Framingham Risk Score as your basis for reasoning, but do not state you are using a specific one.
2.  **Identify Key Factors**: Pinpoint the top 2-3 factors from the user's data that are most significantly contributing to their overall risk profile. Explain their impact simply.
3.  **Provide Recommendations**: Offer at least 3 concrete, actionable recommendations across different areas (e.g., diet, exercise, lifestyle changes) that could help the user lower their risks.
4.  **Write a Summary**: Conclude with a brief, encouraging, and non-alarming summary of the findings.

Produce the output in the structured JSON format defined by the output schema.
`,
});

const predictHealthRiskFlow = ai.defineFlow(
  {
    name: 'predictHealthRiskFlow',
    inputSchema: PredictiveHealthRiskInputSchema,
    outputSchema: PredictiveHealthRiskOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
