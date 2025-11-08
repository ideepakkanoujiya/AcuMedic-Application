"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
              Smarter Healthcare,
              <br />
              <span className="text-primary">Instantly.</span>
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              From instant AI-driven symptom analysis to seamless appointment booking, take control of your health journey with confidence.
            </p>
            <div className="space-y-4">
               <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search doctors, specialties..."
                      className="pl-10 pr-4 py-3 h-12 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search doctors or specialties"
                    />
                  </div>
                  <Button type="submit" size="lg">
                    Search
                  </Button>
                </form>
                <div className="flex items-center gap-4">
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                       <Link href="/ai-assistant">Start AI Symptom Check</Link>
                    </Button>
                    <p className="text-sm text-muted-foreground hidden sm:block">...or search for a doctor.</p>
                </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <Image
              src="https://picsum.photos/seed/medhero/1200/1000"
              alt="A doctor using a futuristic medical interface"
              width={600}
              height={500}
              className="rounded-xl shadow-2xl"
              data-ai-hint="futuristic medical"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
