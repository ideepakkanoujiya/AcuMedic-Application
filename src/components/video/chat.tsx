'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Mic, Send, User, Loader2 } from 'lucide-react';
import { aiSymptomChecker } from '@/ai/flows/ai-symptom-checker';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isThinking?: boolean;
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-xs rounded-xl p-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
        
      </motion.div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};


export function VideoCallChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  const handleSendMessage = useCallback(async (text: string, isVoiceInput: boolean = false) => {
    if (!text || text.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    finalTranscriptRef.current = '';
    setIsLoading(true);

    const thinkingMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: '...', isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const result = await aiSymptomChecker({
        symptoms: text,
        voiceInput: isVoiceInput ? text : undefined,
      });
      
      const botResponse: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: result.response,
      };

      setMessages(prev => prev.map(m => m.id === thinkingMessage.id ? botResponse : m));

    } catch (error) {
      console.error("Error calling AI assistant:", error);
       toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "I'm sorry, I encountered an error. Please try again.",
      });
      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: 'I am sorry, but I was unable to process your request. Please try again.',
      };
      setMessages(prev => prev.map(m => m.id === thinkingMessage.id ? errorResponse : m));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  useEffect(() => {
    // This effect should run only once to initialize speech recognition.
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        finalTranscriptRef.current = finalTranscript;
        setInput(finalTranscript || interimTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        // Use the ref for the most up-to-date transcript to avoid stale state
        if (finalTranscriptRef.current && finalTranscriptRef.current.trim().length > 0) {
            handleSendMessage(finalTranscriptRef.current, true);
        }
      };

      recognition.onerror = (event: any) => {
        toast({
            variant: "destructive",
            title: "Voice Recognition Error",
            description: `An error occurred: ${event.error}. Please check your microphone or browser permissions.`,
        });
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
        toast({
            variant: "destructive",
            title: "Unsupported Browser",
            description: "Your browser does not support voice recognition.",
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only ONCE.


  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput('');
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  useEffect(() => {
    setMessages([
        { id: 'initial-1', sender: 'bot', text: "Hello! I'm AcuMedic, your in-call AI assistant. How can I help during this consultation?" },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-full flex flex-col border-0 rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot /> AI Assistant</CardTitle>
      </CardHeader>
      <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
        ))}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="relative w-full">
            <Input
              type="text"
              placeholder={isRecording ? "Listening..." : "Ask a question..."}
              className="h-12 pr-28"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(input)}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleMicClick} disabled={isLoading}>
                <Mic className={cn("h-5 w-5", isRecording ? "text-destructive animate-pulse" : "")} />
              </Button>
              <Button size="icon" onClick={() => handleSendMessage(input)} disabled={!input.trim() || isLoading}>
                 {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
      </CardFooter>
    </Card>
  );
}