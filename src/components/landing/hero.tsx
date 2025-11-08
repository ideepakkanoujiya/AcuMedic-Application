"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Stethoscope, Calendar, Users, Globe, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


const IconHeart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const IconMind = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        {...props}
    >
        <path d="M6.5 10.375C6.5 7.424 8.924 5 11.875 5C14.826 5 17.25 7.424 17.25 10.375C17.25 13.326 14.826 15.75 11.875 15.75C10.457 15.75 9.17803 15.19 8.21303 14.25M6.5 10.375C6.5 10.963 6.696 11.5 7 11.938M6.5 10.375C5.904 10.375 5.5 9.971 5.5 9.375C5.5 8.779 5.904 8.375 6.5 8.375C7.096 8.375 7.5 8.779 7.5 9.375C7.5 9.971 7.096 10.375 6.5 10.375ZM9.5 18.25C9.5 18.25 9.125 17.25 10.25 16.75M13.5 18.25C13.5 18.25 13.875 17.25 12.75 16.75M11.5 19.25V15.75M17.5 13.375C17.5 13.375 19 12.375 19.5 13.75M18.5 7.375C18.5 7.375 19.5 6 20.5 6.5M5.5 14.375C5.5 14.375 4 15.375 3.5 13.75M4.5 7.375C4.5 7.375 3.5 6 2.5 6.5M11.875 5C11.875 5 10.875 3 12.375 2M11.875 5C11.875 5 12.875 3 14.375 2"/>
    </svg>
);


const baseSuggestions = [
    { name: 'Check Symptoms', href: '/symptom-checker', icon: <Bot className="h-5 w-5 text-primary" /> },
    { name: 'Find a Specialist', href: '/doctors', icon: <Stethoscope className="h-5 w-5 text-primary" /> },
    { name: 'Book an Appointment', href: '/book', icon: <Calendar className="h-5 w-5 text-primary" /> },
    { name: 'Live Queue Status', href: '/queue', icon: <Users className="h-5 w-5 text-primary" /> },
];

const floatingIcons = [
  { icon: IconHeart, className: 'top-[15%] left-[5%] w-16 h-16', duration: 12 },
  { icon: IconMind, className: 'top-[20%] right-[8%] w-14 h-14 stroke-current', duration: 10 },
  { icon: IconHeart, className: 'bottom-[15%] left-[15%] w-12 h-12', duration: 15 },
  { icon: IconMind, className: 'bottom-[10%] right-[12%] w-10 h-10 stroke-current', duration: 9 },
  { icon: IconHeart, className: 'top-[50%] left-[20%] w-8 h-8', duration: 8 },
  { icon: IconMind, className: 'top-[60%] right-[25%] w-12 h-12 stroke-current', duration: 14 },
];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
      setPopoverOpen(false);
    }
  };

  const dynamicSuggestions = searchTerm.trim()
    ? [
        { name: `Web Search for "${searchTerm}"`, href: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, icon: <Globe className="h-5 w-5 text-primary" />, external: true },
        ...baseSuggestions,
      ]
    : baseSuggestions;


  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>

       {floatingIcons.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            className={cn("absolute text-primary/10", item.className)}
            animate={{
              y: ["0%", "5%", "0%", "-5%", "0%"],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon />
          </motion.div>
        )
      })}

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
              Instant care. Intelligent support
              <br />— <span className="text-primary">anytime, anywhere</span>
            </h1>
            <p className="max-w-[600px] mx-auto text-lg text-muted-foreground">
              From instant AI-driven symptom analysis to seamless appointment booking, take control of your health journey with confidence.
            </p>
            <motion.div 
              className="w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                   <form onSubmit={handleSearch} className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        type="text"
                        placeholder="Search symptoms, doctors or specialties..."
                        className="pl-12 pr-4 py-3 h-14 text-base w-full rounded-full shadow-lg transition-all duration-300 focus-visible:shadow-2xl focus-visible:ring-primary/50 focus-visible:ring-2 bg-background/80 backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setPopoverOpen(true)}
                        aria-label="Search doctors or specialties"
                      />
                       <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10">
                        Search
                      </Button>
                    </form>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="w-[calc(100vw-2rem)] sm:w-[500px] md:w-[640px] p-4" align="center">
                    <p className="text-sm font-medium text-muted-foreground mb-3 px-2">Suggestions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dynamicSuggestions.map((item) => (
                           <Link key={item.name} href={item.href} target={item.external ? '_blank' : '_self'} rel={item.external ? 'noopener noreferrer' : ''} className="block" onClick={() => setPopoverOpen(false)}>
                            <div className={cn("flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors cursor-pointer")}>
                                {item.icon}
                                <span className="font-medium text-sm truncate">{item.name}</span>
                            </div>
                           </Link>
                        ))}
                    </div>
                </PopoverContent>
              </Popover>

                <div className="mt-6 flex items-center justify-center gap-4">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-400 text-white shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105" 
                      asChild
                    >
                       <Link href="/symptom-checker">Start AI Symptom Check</Link>
                    </Button>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
