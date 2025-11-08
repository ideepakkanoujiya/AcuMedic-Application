'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot, ImagePlus, Mic, Send, User, X, Loader2, Phone, Calendar, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  imagePreview?: string;
}

const ChatMessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><Bot /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-xs md:max-w-md rounded-xl p-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.imagePreview && (
          <Image
            src={message.imagePreview}
            alt="Uploaded content"
            width={200}
            height={200}
            className="rounded-md mb-2"
          />
        )}
        <p className="text-sm">{message.text}</p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};


export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AISymptomCheckerOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMessages([
        { sender: 'bot', text: "Hello! I'm your AI Health Assistant. Please describe your symptoms. You can also upload an image if needed." }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' && !imageFile) return;
    setIsLoading(true);
    setAnalysis(null);

    const userMessage: Message = { sender: 'user', text: input };
    if (imagePreview) {
      userMessage.imagePreview = imagePreview;
    }

    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentImagePreview = imagePreview;

    setInput('');
    setImageFile(null);
    setImagePreview(null);
    
    // Initial bot thinking message
    setMessages(prev => [...prev, { sender: 'bot', text: 'Analyzing your symptoms...' }]);

    try {
      const result = await aiSymptomChecker({
        symptoms: currentInput,
        image: currentImagePreview ?? undefined,
      });

      setAnalysis(result);
      
      const botResponse: Message = {
        sender: 'bot',
        text: result.detailedAnalysis,
      };

      setMessages(prev => [...prev.slice(0, -1), botResponse]);

    } catch (error) {
      console.error("Error calling AI symptom checker:", error);
       toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "I'm sorry, but I was unable to analyze your symptoms. Please try again.",
      });
      const errorResponse: Message = {
        sender: 'bot',
        text: 'I am sorry, but I was unable to analyze your symptoms. Please try again.',
      };
      setMessages(prev => [...prev.slice(0, -1), errorResponse]);
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
  }

  const urgencyBadgeVariant = useMemo(() => {
    if (!analysis) return 'default';
    switch (analysis.emergencyLevel.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'urgent':
        return 'secondary';
      default:
        return 'default';
    }
  }, [analysis]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 grid lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col h-screen bg-muted/20">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <ChatMessageBubble key={index} message={msg} />
            ))}
             {isLoading && messages[messages.length - 1]?.sender !== 'user' && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs md:max-w-md rounded-xl p-3 bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin"/>
                  </div>
                </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 border-t bg-background"
          >
            {imagePreview && (
              <div className="relative w-24 h-24 mb-2 p-1 border rounded-md">
                  <Image src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" width={96} height={96}/>
                  <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 z-10 rounded-full" onClick={removeImage}>
                      <X className="h-4 w-4"/>
                  </Button>
              </div>
            )}
            <div className="relative">
              <Input
                type="text"
                placeholder="Describe your symptoms..."
                className="h-12 pr-28"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                  <ImagePlus className="h-5 w-5" />
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <Button variant="ghost" size="icon" disabled={isLoading}>
                  <Mic className="h-5 w-5" />
                </Button>
                <Button size="icon" onClick={handleSendMessage} disabled={(!input.trim() && !imageFile) || isLoading}>
                   {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="hidden lg:block lg:col-span-1 p-6 border-l overflow-y-auto bg-background h-screen">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
          {analysis ? (
            <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className={cn("h-6 w-6", urgencyBadgeVariant === 'destructive' ? 'text-destructive': 'text-yellow-500')} />
                  Urgency Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={urgencyBadgeVariant} className="text-base capitalize">{analysis.emergencyLevel}</Badge>
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
            </>
            ) : (
               <div className="text-center py-12 text-muted-foreground">
                  <Bot className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">Awaiting Analysis</h3>
                  <p className="mt-1 text-sm">The AI's analysis will appear here once you describe your symptoms.</p>
                </div>
            )}
          </motion.div>
        </aside>
      </main>
    </div>
  );
}

// Dummy Header component to avoid breaking layout, as it's not the focus of the change.
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
         <Link href="/" className="font-bold">MediQ AI</Link>
         <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
       </div>
    </header>
  )
}
