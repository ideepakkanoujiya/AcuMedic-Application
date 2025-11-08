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

const IconPill = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    fill="currentColor"
  >
    <path d="M156.23,28.23,40.48,143.76a44,44,0,0,0,62.24,62.24L218,89.77a44,44,0,0,0-61.77-61.54Z" />
  </svg>
);

const IconVirus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    fill="currentColor"
  >
    <path d="M232,104a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V112A8,8,0,0,0,232,104ZM128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM112,32a8,8,0,0,1-8,8,8,8,0,0,1,0-16A8,8,0,0,1,112,32Zm32,0a8,8,0,0,1-8,8,8,8,0,0,1,0-16A8,8,0,0,1,144,32Zm8,72v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0Zm-32,0v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0Zm-32,0v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0Zm0,32v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0Zm32,0v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0Zm32,0v8a8,8,0,0,0,16,0v-8a8,8,0,0,0-16,0ZM112,224a8,8,0,0,1-8,8,8,8,0,0,1,0-16A8,8,0,0,1,112,224Zm32,0a8,8,0,0,1-8,8,8,8,0,0,1,0-16A8,8,0,0,1,144,224Zm-80-88H80a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16ZM32,144a8,8,0,0,1-8-8,8,8,0,0,1,0,16A8,8,0,0,1,32,144Zm16-32V96a8,8,0,0,0-16,0v16a8,8,0,0,0,16,0Z" />
  </svg>
);

const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    fill="currentColor"
  >
    <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
  </svg>
);

const IconDna = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    fill="currentColor"
  >
    <path d="M229.49,65.4l-48-32a12,12,0,1,0-12.91,19.29l22.4,15C136.2,85.1,123.7,128.8,131,168.32l-22.31,14.88a12,12,0,1,0,12.62,19l48-32a12,12,0,1,0-12.62-19L134.4,166.1c-6.19-33,4.4-71,58.07-88.42l22.4,15A12,12,0,1,0,229.49,65.4ZM125,87.68c-53.67-17.4-66.17,26.3-58.09,60.22L34.51,174.6a12,12,0,1,0,12.62,19l48-32a12,12,0,1,0-12.62-19l-22.31,14.88C52.3,123.2,64.8,79.5,119.58,97.1l22.31-14.88a12,12,0,1,0-12.62-19Z" />
  </svg>
);


const baseSuggestions = [
    { name: 'Check Symptoms', href: '/symptom-checker', icon: <Bot className="h-5 w-5 text-primary" /> },
    { name: 'Find a Specialist', href: '/doctors', icon: <Stethoscope className="h-5 w-5 text-primary" /> },
    { name: 'Book an Appointment', href: '/book', icon: <Calendar className="h-5 w-5 text-primary" /> },
    { name: 'Live Queue Status', href: '/queue', icon: <Users className="h-5 w-5 text-primary" /> },
];

const floatingIcons = [
  { icon: IconPill, className: 'top-[10%] left-[5%] w-16 h-16', duration: 12 },
  { icon: IconVirus, className: 'top-[20%] right-[8%] w-12 h-12', duration: 10 },
  { icon: IconDna, className: 'bottom-[15%] left-[15%] w-14 h-14', duration: 15 },
  { icon: IconPlus, className: 'bottom-[10%] right-[12%] w-10 h-10', duration: 9 },
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
              Your Health,
              <br />
              <span className="text-primary">Decoded.</span>
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
