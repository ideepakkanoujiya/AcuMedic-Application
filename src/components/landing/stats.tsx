"use client";

import { CheckCircle2, Clock, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: "152 Doctors Online", icon: <CheckCircle2 className="h-5 w-5 text-green-400" /> },
  { value: "Avg Wait 12m", icon: <Clock className="h-5 w-5 text-yellow-400" /> },
  { value: "341 Appointments Today", icon: <CalendarDays className="h-5 w-5 text-blue-400" /> },
];

export default function Stats() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-muted/30 dark:bg-muted/20 border-y">
      <div className="container py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2">
              {stat.icon}
              <p className="text-sm sm:text-base text-muted-foreground font-medium">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
