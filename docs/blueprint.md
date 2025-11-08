# **App Name**: MediQ AI

## Core Features:

- AI Symptom Checker: Accepts multi-language input (English, Hindi, Hinglish) via text, voice, and optional image upload. AI triage returns emergency level, possible conditions, and recommended specialty using Gemini as a tool.
- Appointment Booking Engine: Allows users to select a doctor, clinic, or video consultation, displaying real-time slot availability with database-backed booking and confirmation.
- Video Consultation: Enables users to choose between in-clinic or tele-consultation, generating a secure video link accessible via a "Join Call" button on the dashboard.
- Live Queue & Wait Time Tracking: Provides patients with real-time updates on queue length and estimated wait time, updated via WebSockets. Doctors can manage the queue manually.
- WhatsApp Chatbot Booking System: Allows users to book appointments through a WhatsApp chatbot that reads symptoms, suggests doctors, and confirms bookings using Hindi and English NLP.
- Preventive Care Auto-Reminder System: Sends reminders for lab tests, vaccinations, annual checkups, and chronic disease follow-ups via WhatsApp, email, or SMS, scheduled by a cron job monitoring patient history.
- Doctor Dashboard: Provides doctors with a dashboard to view appointments, upload patient reports (PDF/JPG/PNG), manage slot availability, and update appointment statuses.
- Patient Dashboard: Shows upcoming appointments, uploaded reports, preventive care reminders, and queue status to the patient.
- Medical Report System: Allows doctors to upload files which can later be viewed/downloaded by the patient. Optionally, summarize the report using generative AI as a tool.

## Style Guidelines:

- Primary color: Soothing blue (#5390D9), evoking trust and stability.  Derived from UI quality matches to Practo, Apollo 24/7, Zocdoc, and Ada Health.
- Background color: Light blue (#EAF2FF), a very desaturated version of the primary color, for a calm, clean feel.
- Accent color: Gentle cyan (#70C1B3), to complement the primary hue with freshness, while providing contrast.
- Body and headline font: 'Inter' sans-serif for a modern, machined, objective look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Consistent, modern icon set from a library like Phosphor or Tabler, to match UI references.
- Card-based layout with soft shadows for an elevated feel, as requested in UI/UX requirements.
- Subtle entrance animations and smooth transitions using Framer Motion.