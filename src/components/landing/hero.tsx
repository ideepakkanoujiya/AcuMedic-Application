
"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Stethoscope, Ambulance, Hospital, Bot, BrainCircuit, HeartPulse, Dna } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


const suggestions = [
    { name: 'Check Symptoms', href: '/ai-assistant', icon: <Bot className="h-5 w-5 text-primary" /> },
    { name: 'Find a Specialist', href: '/doctors', icon: <Stethoscope className="h-5 w-5 text-primary" /> },
    { name: 'Nearby Hospitals', href: 'https://www.google.com/maps/search/nearby+hospitals', icon: <Hospital className="h-5 w-5 text-primary" />, external: true },
    { name: 'Call an Ambulance', href: 'tel:112', icon: <Ambulance className="h-5 w-5 text-destructive" />, external: true },
];

const floatingIcons = [
  { icon: BrainCircuit, className: 'top-[10%] left-[5%] w-16 h-16', duration: 12 },
  { icon: HeartPulse, className: 'top-[20%] right-[8%] w-12 h-12', duration: 10 },
  { icon: Dna, className: 'bottom-[15%] left-[15%] w-14 h-14', duration: 15 },
  { icon: Stethoscope, className: 'bottom-[10%] right-[12%] w-10 h-10', duration: 9 },
];

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchTerm)}`);
    }
  };

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
              Smarter Healthcare,
              <br />
              <span className="text-primary">Instantly.</span>
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
                   <form onSubmit={handleSearch} className="relative group" onClick={() => setPopoverOpen(true)}>
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        type="text"
                        placeholder="Search symptoms, doctors or specialties..."
                        className="pl-12 pr-4 py-3 h-14 text-base w-full rounded-full shadow-lg transition-all duration-300 focus-visible:shadow-2xl focus-visible:ring-primary/50 focus-visible:ring-2 bg-background/80 backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search doctors or specialties"
                      />
                       <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10">
                        Search
                      </Button>
                    </form>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[500px] md:w-[640px] p-4" align="center">
                    <p className="text-sm font-medium text-muted-foreground mb-3 px-2">Suggestions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestions.map((item) => (
                           <Link key={item.name} href={item.href} target={item.external ? '_blank' : '_self'} rel={item.external ? 'noopener noreferrer' : ''} className="block">
                            <div className={cn("flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors cursor-pointer", item.name.includes('Ambulance') && 'text-destructive hover:bg-destructive/10')}>
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
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
                       <Link href="/ai-assistant">Start AI Symptom Check</Link>
                    </Button>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
