"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

export default function Hero() {
  const router = useRouter();
  const [symptom, setSymptom] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptom.trim()) {
      router.push(`/dashboard?symptom=${encodeURIComponent(symptom)}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
          <div className="gradient-background"></div>
      </div>
      <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
            Your Health, <br />
            <span className="text-primary">Intelligently Guided.</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Get instant medical guidance with our AI-powered symptom checker, book appointments seamlessly, and take control of your health journey.
          </p>
          <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search symptoms, doctors or specialties..."
                className="pl-10 pr-4 py-3 h-12 text-base bg-background/50"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                aria-label="Search symptoms, doctors or specialties"
              />
            </div>
            <Button type="submit" size="lg" className="bg-primary/90 hover:bg-primary">
              Search
            </Button>
          </form>
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.438 2.992a10.003 10.003 0 1 0 11.566 11.566l-2.094-3.625a10.01 10.01 0 0 0-7.38-7.38L11.438 2.99Z" /><path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" /><path d="m22 2-2.25 1.75" /><path d="m14 2.75 1.75 2.25" /><path d="m2.75 10-2.25 1.75" /><path d="m2.75 14 2.25 1.75" /><path d="M10 21.25 11.75 19" /></svg>
              <p>Powered by Gemini AI</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block"
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={1200}
              height={800}
              className="rounded-xl shadow-2xl"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
