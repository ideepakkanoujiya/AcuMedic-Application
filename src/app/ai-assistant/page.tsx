'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot, ImagePlus, Mic, Send, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '' && !imageFile) return;

    const userMessage: Message = { sender: 'user', text: input };
    if (imagePreview) {
      userMessage.imagePreview = imagePreview;
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImageFile(null);
    setImagePreview(null);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'I am analyzing your symptoms. Please wait a moment.' }]);
    }, 1000);
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

  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-4 h-[calc(100vh-4rem)]">
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col h-full bg-muted/20">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          <ChatMessageBubble message={{ sender: 'bot', text: "Hello! I'm your AI Health Assistant. Please describe your symptoms. You can also upload an image if needed." }} />
          {messages.map((msg, index) => (
            <ChatMessageBubble key={index} message={msg} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 border-t bg-background"
        >
          {imagePreview && (
            <div className="relative w-24 h-24 mb-2 p-1 border rounded-md">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md"/>
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
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="h-5 w-5" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() && !imageFile}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <aside className="hidden lg:block lg:col-span-1 p-6 border-l overflow-y-auto bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-destructive h-6 w-6" />
                Urgency Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="destructive" className="text-base">High Urgency</Badge>
              <p className="text-muted-foreground mt-2 text-sm">Based on the provided symptoms, immediate medical attention is recommended.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Triage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Possible Conditions</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm">
                    <li>Condition A</li>
                    <li>Condition B</li>
                </ul>
              </div>
               <div>
                <h4 className="font-semibold">Recommended Specialty</h4>
                <p className="text-muted-foreground text-sm">Cardiology</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Find a Specialist</Button>
              <Button variant="outline" className="w-full">Book a Video Consultation</Button>
            </CardContent>
          </Card>
        </motion.div>
      </aside>
    </div>
  );
}
