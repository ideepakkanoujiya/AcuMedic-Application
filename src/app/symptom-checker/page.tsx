"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, Upload, File as FileIcon, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function SymptomCheckerPage() {
  const searchParams = useSearchParams();
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AISymptomCheckerOutput | { error: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const symptomFromURL = searchParams.get('symptom');
    if (symptomFromURL) {
      setSymptoms(symptomFromURL);
    }
  }, [searchParams]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setSymptoms(prev => prev + finalTranscript);
      };

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      }

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
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

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSymptomCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const imageAsDataUri = imageFile ? await toBase64(imageFile) : undefined;
      const res = await aiSymptomChecker({ symptoms, image: imageAsDataUri });
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred while checking symptoms.' });
    }
    setLoading(false);
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center font-headline">AI Symptom Checker</h1>
        <p className="text-muted-foreground text-center mb-8">
          Describe your symptoms, add an image if relevant, and get instant guidance from our AI.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="symptom-input">Symptoms</Label>
                <div className="relative">
                  <Textarea
                    id="symptom-input"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., I have a high fever, a persistent cough, and body aches..."
                    rows={6}
                    className="pr-12"
                  />
                  <Button
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className="absolute top-3 right-3"
                    onClick={handleMicClick}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                 {isListening && <p className="text-sm text-primary mt-2">Listening... Say "stop" to end.</p>}
              </div>

              <div>
                <Label htmlFor="file-upload">Upload an Image (optional)</Label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg" />
                         <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10" onClick={(e) => { e.preventDefault(); removeImage();}}>
                           <X className="h-4 w-4"/>
                         </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (max 5MB)</p>
                      </div>
                    )}
                     <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                  </label>
                </div>
              </div>

              <Button onClick={handleSymptomCheck} disabled={loading || !symptoms.trim()} className="w-full" size="lg">
                {loading ? 'Analyzing Symptoms...' : 'Get AI Analysis'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
            <div className="mt-6 text-center">
              <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-muted-foreground animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted-foreground">Our AI is analyzing your symptoms. This may take a moment...</p>
            </div>
        )}

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {'error' in result ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="space-y-4">
                   <div>
                    <h3 className="font-semibold">Emergency Level</h3>
                    <p className={`font-bold ${result.emergencyLevel === 'critical' ? 'text-red-500' : result.emergencyLevel === 'urgent' ? 'text-yellow-500' : 'text-green-500'}`}>{result.emergencyLevel.charAt(0).toUpperCase() + result.emergencyLevel.slice(1)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Possible Conditions</h3>
                    <ul className="list-disc list-inside">
                      {result.possibleConditions.map((condition, i) => <li key={i}>{condition}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">Recommended Specialty</h3>
                    <p>{result.recommendedSpecialty}</p>
                  </div>
                   <p className="text-sm text-muted-foreground pt-4 border-t">Disclaimer: This is not a medical diagnosis. Please consult with a qualified healthcare professional for any health concerns.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}