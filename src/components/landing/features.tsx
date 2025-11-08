"use client";
import { Bot, Clock, MessageSquare, FolderClock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI Symptom Checker",
    description: "Get an initial diagnosis and recommendation from our advanced AI.",
    href: "/symptom-checker",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Smart Queue & Wait Time",
    description: "Track your queue position and wait time in real-time. No more guessing.",
    href: "#",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "WhatsApp Booking",
    description: "Book appointments directly through WhatsApp for ultimate convenience.",
    href: "#",
  },
  {
    icon: <FolderClock className="h-8 w-8 text-primary" />,
    title: "Report Storage & History",
    description: "Securely store and access your medical reports and history anytime.",
    href: "#",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-headline">A New Era of Healthcare</motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-muted-foreground md:text-lg">
            MediQ AI combines cutting-edge technology with compassionate care to bring you a seamless healthcare experience.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const cardContent = (
               <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-2 h-full bg-card/50 backdrop-blur-sm">
                <CardHeader className="items-center p-6">
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {feature.href !== '#' && feature.href ? (
                  <Link href={feature.href} className="block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
