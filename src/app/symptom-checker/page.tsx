'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Bot, ImagePlus, Loader2, X, Phone, Calendar, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const NextSteps = ({ analysis }: { analysis: AISymptomCheckerOutput }) => {
  const urgencyBadgeVariant = () => {
    if (!analysis) return 'default';
    switch (analysis.emergencyLevel.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'urgent':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className={cn("h-6 w-6", urgencyBadgeVariant() === 'destructive' ? 'text-destructive': 'text-yellow-500')} />
            Urgency Warning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={urgencyBadgeVariant()} className="text-base capitalize">{analysis.emergencyLevel}</Badge>
          <p className="text-muted-foreground mt-2 text-sm">Based on the provided symptoms, please consider the recommended next steps.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Triage Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
              <h4 className="font-semibold">Detailed Analysis</h4>
              <p className="text-muted-foreground text-sm">{analysis.detailedAnalysis}</p>
          </div>
          <div>
            <h4 className="font-semibold">Possible Conditions</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm">
                {analysis.possibleConditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
            </ul>
          </div>
           <div>
            <h4 className="font-semibold">Recommended Specialty</h4>
            <p className="text-muted-foreground text-sm">{analysis.recommendedSpecialty}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.emergencyLevel.toLowerCase() === 'critical' ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>This is a potential emergency.</AlertTitle>
                <AlertDescription>
                  Please call your local emergency number immediately.
                </AlertDescription>
                <Button asChild className="mt-4 w-full">
                  <a href="tel:112">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 112 Now
                  </a>
                </Button>
              </Alert>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                     <Button className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book an Appointment
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Book an Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Based on your symptoms, we recommend a <span className="font-bold">{analysis.recommendedSpecialty}</span>. 
                        Please select a doctor to proceed.
                      </p>
                      <div className="space-y-2">
                        {/* This would be dynamically populated */}
                        <Button variant="outline" className="w-full justify-start h-auto py-2">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src="https://picsum.photos/seed/doc1/200/200" />
                                <AvatarFallback>DC</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-left">Dr. Emily Carter</p>
                                <p className="text-xs text-muted-foreground text-left">{analysis.recommendedSpecialty}</p>
                              </div>
                            </div>
                        </Button>
                         <Button variant="outline" className="w-full justify-start h-auto py-2">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src="https://picsum.photos/seed/doc5/200/200" />
                                <AvatarFallback>DP</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-left">Dr. Priya Sharma</p>
                                <p className="text-xs text-muted-foreground text-left">{analysis.recommendedSpecialty}</p>
                              </div>
                            </div>
                        </Button>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link href="/book">
                          Continue to Booking
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                 <Button variant="outline" className="w-full" asChild>
                   <Link href={`/doctors?specialty=${analysis.recommendedSpecialty}`}>
                    <Video className="mr-2 h-4 w-4" />
                    Book a Video Consultation
                   </Link>
                 </Button>
              </>
            )}
          </CardContent>
        </Card>
    </div>
  );
}


export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AISymptomCheckerOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (symptoms.trim() === '') {
      toast({
        variant: "destructive",
        title: "Symptoms required",
        description: "Please describe your symptoms before proceeding.",
      });
      return;
    };
    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await aiSymptomChecker({
        symptoms: symptoms,
        image: imagePreview ?? undefined,
      });

      setAnalysis(result);

    } catch (error) {
      console.error("Error calling AI symptom checker:", error);
       toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "I'm sorry, but I was unable to analyze your symptoms. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setSymptoms('');
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
        >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">AI Symptom Checker</h1>
            <p className="text-muted-foreground mb-8">
                Describe your symptoms to get an instant AI-powered analysis and triage assessment.
            </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle>Describe Your Symptoms</CardTitle>
                        <CardDescription>Provide as much detail as possible for a more accurate analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="e.g., I have a high fever, a sore throat, and a persistent cough..."
                            className="min-h-[150px] text-base"
                            value={symptoms}
                            onChange={e => setSymptoms(e.target.value)}
                            disabled={isLoading || !!analysis}
                        />

                        {imagePreview ? (
                          <div className="relative w-full h-40 p-1 border rounded-md">
                              <Image src={imagePreview} alt="Preview" layout="fill" className="object-cover rounded-md" />
                              <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 z-10 rounded-full" onClick={removeImage} disabled={isLoading || !!analysis}>
                                  <X className="h-4 w-4"/>
                              </Button>
                          </div>
                        ) : (
                          <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoading || !!analysis}>
                              <ImagePlus className="mr-2 h-4 w-4" />
                              Upload an Image (Optional)
                          </Button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                        {analysis ? (
                             <Button onClick={handleReset} className="w-full" variant="outline">
                                Start Over
                            </Button>
                        ) : (
                            <Button onClick={handleAnalysis} disabled={!symptoms.trim() || isLoading} className="w-full" size="lg">
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Analyze Symptoms'}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              {analysis ? (
                <NextSteps analysis={analysis} />
              ) : (
                <Card className="flex flex-col items-center justify-center text-center py-12 px-6 min-h-[400px] shadow-lg">
                    <Bot className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-6 text-xl font-semibold">Awaiting Analysis</h3>
                    <p className="mt-2 text-muted-foreground max-w-sm">Your AI-powered health analysis will appear here once you describe your symptoms and click "Analyze".</p>
                </Card>
              )}
            </motion.div>
        </div>
    </div>
  );
}
