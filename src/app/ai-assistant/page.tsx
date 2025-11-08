'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Mic, Send, User, Loader2 } from 'lucide-react';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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
      <div
        className={`max-w-xs md:max-w-md rounded-xl p-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <p className="text-sm">{message.text}</p>}
        
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMessages([
        { id: 'initial-1', sender: 'bot', text: "Hello! I'm your conversational AI Health Assistant." },
        { id: 'initial-2', sender: 'bot', text: "You can ask me to check your symptoms, define medical terms, or help you find a specialist. How can I help you today?" }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const thinkingMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: '...', isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // For this example, we'll continue using the symptom checker as the primary "tool".
      // A more advanced implementation would use a router or a more complex prompt
      // to decide which tool/flow to call based on the user's input.
      const result = await aiSymptomChecker({
        symptoms: currentInput,
      });

      let responseText = result.detailedAnalysis;

      if (result.possibleConditions && result.possibleConditions.length > 0) {
        responseText += `\n\nSome possible conditions could be: ${result.possibleConditions.join(', ')}.`;
      }
      if (result.recommendedSpecialty) {
        responseText += `\n\nI recommend consulting a ${result.recommendedSpecialty}.`;
      }
       if (result.emergencyLevel.toLowerCase() === 'critical') {
        responseText += `\n\n**This could be a critical situation. Please consider calling emergency services immediately.**`;
      }


      const botResponse: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: responseText,
      };

      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id).concat(botResponse));

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
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id).concat(errorResponse));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
         <Link href="/" className="font-bold">MediQ AI Assistant</Link>
         <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
       </div>
      </header>
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-muted/20">
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
              type="text"
              placeholder="Ask me anything about your health..."
              className="h-12 pr-28"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                 {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
