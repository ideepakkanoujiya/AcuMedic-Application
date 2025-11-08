'use server';

/**
 * @fileOverview This file defines a Genkit flow for booking appointments through a WhatsApp chatbot.
 *
 * The chatbot supports Hindi and English, reads symptoms, suggests doctors, and confirms bookings.
 *
 * - whatsappChatbotBooking - The main function to initiate the chatbot booking process.
 * - WhatsAppChatbotBookingInput - The input type for the whatsappChatbotBooking function.
 * - WhatsAppChatbotBookingOutput - The return type for the whatsappChatbotBooking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhatsAppChatbotBookingInputSchema = z.object({
  language: z.enum(['en', 'hi']).describe('The language of the user input (en for English, hi for Hindi).'),
  symptoms: z.string().describe('The symptoms described by the patient.'),
});
export type WhatsAppChatbotBookingInput = z.infer<typeof WhatsAppChatbotBookingInputSchema>;

const WhatsAppChatbotBookingOutputSchema = z.object({
  suggestedDoctor: z.string().describe('The name of the suggested doctor.'),
  bookingConfirmation: z.string().describe('A confirmation message for the appointment booking.'),
});
export type WhatsAppChatbotBookingOutput = z.infer<typeof WhatsAppChatbotBookingOutputSchema>;

export async function whatsappChatbotBooking(input: WhatsAppChatbotBookingInput): Promise<WhatsAppChatbotBookingOutput> {
  return whatsappChatbotBookingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whatsappChatbotBookingPrompt',
  input: {schema: WhatsAppChatbotBookingInputSchema},
  output: {schema: WhatsAppChatbotBookingOutputSchema},
  prompt: `You are a helpful AI assistant that helps patients book appointments with doctors.

The patient will provide their symptoms and preferred language, and you will suggest a doctor and confirm the booking.

Language: {{{language}}}
Symptoms: {{{symptoms}}}

Respond in the same language as the input.

Suggest a doctor and confirm the booking in a single message.

Example:
Symptoms: Mujhe bukhar aur sardi hai.
Suggested Doctor: Dr. Rajesh Kumar
Booking Confirmation: Appointment booked with Dr. Rajesh Kumar for tomorrow at 10:00 AM.

Now, respond to the patient's symptoms and language.
`,
});

const whatsappChatbotBookingFlow = ai.defineFlow(
  {
    name: 'whatsappChatbotBookingFlow',
    inputSchema: WhatsAppChatbotBookingInputSchema,
    outputSchema: WhatsAppChatbotBookingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
