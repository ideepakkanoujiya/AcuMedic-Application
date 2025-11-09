import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/summarize-medical-report.ts';
import '@/ai/flows/predictive-health-risk-flow.ts';
