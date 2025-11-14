'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/summarize-medical-report.ts';
import '@/ai/flows/predictive-health-risk-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
import '@/ai/flows/agora-llm-proxy-flow.ts';
import '@/ai/flows/generate-doctor-briefing-flow.ts';
