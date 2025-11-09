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
        className={`max-w-xs md:max-w-2xl rounded-xl p-3 ${
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


export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSendMessage = useCallback(async (isVoiceInput: boolean = false) => {
    const currentInput = inputRef.current?.value;
    if (!currentInput || currentInput.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: currentInput };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setIsLoading(true);

    const thinkingMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: '...', isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const result = await aiSymptomChecker({
        symptoms: currentInput,
        voiceInput: isVoiceInput ? currentInput : undefined,
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
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // Using a short timeout to ensure the final transcript is set before sending
        setTimeout(() => {
            if (inputRef.current?.value && inputRef.current.value.trim().length > 0) {
              handleSendMessage(true);
            }
        }, 100);
      };
    }
  }, [handleSendMessage]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        toast({
            variant: "destructive",
            title: "Voice input not supported",
            description: "Your browser does not support voice recognition.",
        });
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  useEffect(() => {
    setMessages([
        { id: 'initial-1', sender: 'bot', text: "Hello! I'm your conversational AI Health Assistant, AcuMedic." },
        { id: 'initial-2', sender: 'bot', text: "You can ask me to check your symptoms, define medical terms, or help you find a specialist. How can I help you today?" }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 flex flex-col h-full bg-muted/20">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 border-t bg-background"
        >
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={isRecording ? "Listening..." : "Ask me anything about your health..."}
              className="h-12 pr-28"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleMicClick} disabled={isLoading}>
                <Mic className={cn("h-5 w-5", isRecording ? "text-destructive animate-pulse" : "")} />
              </Button>
              <Button size="icon" onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading}>
                 {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

    