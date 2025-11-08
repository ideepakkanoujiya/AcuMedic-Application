"use client";

import { Users, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: "152", label: "Doctors Online", icon: <Users className="h-6 w-6 text-primary" /> },
  { value: "12m", label: "Average Wait Time", icon: <Clock className="h-6 w-6 text-primary" /> },
  { value: "12k+", label: "Patients Served", icon: <CheckCircle2 className="h-6 w-6 text-accent" /> },
];

export default function Stats() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-muted/50 border-y">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-2">
              {stat.icon}
              <p className="text-3xl md:text-4xl font-bold font-headline text-foreground">{stat.value}</p>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
