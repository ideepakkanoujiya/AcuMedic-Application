"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { aiSymptomChecker } from '@/ai/flows/ai-symptom-checker';
import { summarizeMedicalReport } from '@/ai/flows/summarize-medical-report';
import { whatsappChatbotBooking } from '@/ai/flows/whatsapp-chatbot-booking';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Dashboard() {
  const [symptomInput, setSymptomInput] = useState('');
  const [reportInput, setReportInput] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSymptomCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await aiSymptomChecker({ symptoms: symptomInput });
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred.' });
    }
    setLoading(false);
  };

  const handleReportSummarize = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await summarizeMedicalReport({ reportText: reportInput });
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred.' });
    }
    setLoading(false);
  };

  const handleWhatsappBooking = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await whatsappChatbotBooking({
        symptoms: whatsappInput,
        language: 'en',
      });
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred.' });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MediQ AI Dashboard</h1>
      <Tabs defaultValue="symptom-checker" className="w-full">
        <TabsList>
          <TabsTrigger value="symptom-checker">AI Symptom Checker</TabsTrigger>
          <TabsTrigger value="report-summarizer">
            Summarize Medical Report
          </TabsTrigger>
          <TabsTrigger value="whatsapp-booking">
            WhatsApp Chatbot Booking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="symptom-checker">
          <Card>
            <CardHeader>
              <CardTitle>AI Symptom Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symptom-input">Symptoms</Label>
                  <Input
                    id="symptom-input"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g., fever and headache"
                  />
                </div>
                <Button onClick={handleSymptomCheck} disabled={loading}>
                  {loading ? 'Checking...' : 'Check Symptoms'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report-summarizer">
          <Card>
            <CardHeader>
              <CardTitle>Summarize Medical Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-input">Medical Report</Label>
                  <Textarea
                    id="report-input"
                    value={reportInput}
                    onChange={(e) => setReportInput(e.target.value)}
                    placeholder="Paste medical report text here..."
                    rows={10}
                  />
                </div>
                <Button onClick={handleReportSummarize} disabled={loading}>
                  {loading ? 'Summarizing...' : 'Summarize Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp-booking">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Chatbot Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp-input">Symptoms</Label>
                  <Input
                    id="whatsapp-input"
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder="Enter symptoms for WhatsApp booking"
                  />
                </div>
                <Button onClick={handleWhatsappBooking} disabled={loading}>
                  {loading ? 'Booking...' : 'Book via WhatsApp'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
