'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Mic, Send, User, Loader2 } from 'lucide-react';
import { aiSymptomChecker } from '@/ai/flows/ai-symptom-checker';
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-xs md:max-w-md rounded-xl p-3 ${
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
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const thinkingMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: '...', isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const result = await aiSymptomChecker({
        symptoms: currentInput,
      });

      let responseText = result.detailedAnalysis;

      if (result.possibleConditions && result.possibleConditions.length > 0) {
        responseText += `\n\n**Possible conditions:** ${result.possibleConditions.join(', ')}.`;
      }
      if (result.recommendedSpecialty) {
        responseText += `\n\nI recommend consulting a **${result.recommendedSpecialty}**.`;
      }
       if (result.emergencyLevel.toLowerCase() === 'critical') {
        responseText += `\n\n**This could be a critical situation. Please consider seeking emergency medical help immediately.**`;
      }


      const botResponse: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: responseText,
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
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
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
              type="text"
              placeholder="Ask me anything about your health..."
              className="h-12 pr-28"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
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