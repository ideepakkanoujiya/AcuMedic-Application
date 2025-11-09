'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, Wand2, ArrowRight, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeMedicalReport, SummarizeMedicalReportOutput } from '@/ai/flows/summarize-medical-report';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SummaryDisplay = ({ summary }: { summary: SummarizeMedicalReportOutput }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Simplified Summary</CardTitle>
        <CardDescription>Here are the key points from your report in plain language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Key Findings</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{summary.simplifiedSummary}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Lightbulb className="text-primary"/>Top Takeaways</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {summary.keyTakeaways.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <Alert>
          <ArrowRight className="h-4 w-4" />
          <AlertTitle>Suggested Next Steps</AlertTitle>
          <AlertDescription>{summary.nextSteps}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ReportSummarizerPage() {
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummarizeMedicalReportOutput | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (reportText.trim().length < 50) {
      toast({
        variant: "destructive",
        title: "Input Too Short",
        description: "Please paste more content from your report for an accurate summary.",
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const result = await summarizeMedicalReport({ reportText });
      setSummary(result);
    } catch (error: any) {
      console.error("Error summarizing report:", error);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: error.message || "The AI model could not process your report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setReportText('');
    setSummary(null);
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">Layman's Report Summarizer</h1>
        <p className="text-muted-foreground mb-8">
          Paste your medical report text below to get a simple, AI-powered summary you can actually understand.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Paste Your Report</CardTitle>
              <CardDescription>Copy the text from your lab report or doctor's notes and paste it here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., CBC revealed WBC at 11.2 x 10^9/L (Ref: 4.5-11.0)..."
                className="min-h-[300px] text-base"
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                disabled={isLoading || !!summary}
              />
              <div className="mt-4">
                {summary ? (
                    <Button onClick={handleReset} variant="outline" className="w-full">Summarize Another Report</Button>
                ) : (
                    <Button onClick={handleSummarize} disabled={!reportText.trim() || isLoading} className="w-full" size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><Wand2 className="mr-2 h-5 w-5" />Summarize It</>}
                    </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <Card className="flex flex-col items-center justify-center text-center py-12 px-6 min-h-[400px]">
              <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
              <h3 className="mt-6 text-xl font-semibold">Generating Your Summary...</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">The AI is translating the medical jargon into simple terms. This might take a moment.</p>
            </Card>
          ) : summary ? (
            <SummaryDisplay summary={summary} />
          ) : (
            <Card className="flex flex-col items-center justify-center text-center py-12 px-6 min-h-[400px] bg-gradient-to-br from-card to-muted/30">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-xl font-semibold">Your Summary Awaits</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">Your simple, easy-to-read summary will appear here once you submit a report.</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
