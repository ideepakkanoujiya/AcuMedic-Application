import { config } from 'dotenv';
config();

import '@/ai/flows/whatsapp-chatbot-booking.ts';
import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/summarize-medical-report.ts';