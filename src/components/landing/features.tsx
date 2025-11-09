"use client";
import { Bot, Users, Video, FileText, HeartPulse } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI Symptom Analysis",
    description: "Get immediate insights on your symptoms with our advanced AI triage.",
    href: "/symptom-checker",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Live Queue Tracking",
    description: "See your real-time position and estimated wait time for your appointment.",
    href: "/queue",
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AcuMedic Assistant",
    description: "Ask any health question, anytime. Get instant, helpful answers from our AI.",
    href: "/ai-assistant",
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Tele-Consultations",
    description: "Connect with top doctors from the comfort of your home via secure video.",
    href: "/doctors",
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Predictive Health Risk",
    description: "Forecast your long-term health risks for chronic diseases using AI.",
    href: "/health-risk-assessment",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Report Summarizer",
    description: "Translate complex lab reports into simple, easy-to-understand language.",
    href: "/report-summarizer",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-headline">The Future of Personalized Healthcare</motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-muted-foreground md:text-lg">
            AcuMedic integrates state-of-the-art technology to provide a healthcare experience that is intelligent, convenient, and tailored to you.
          </motion.p>
        </div>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
             <motion.div key={index} variants={itemVariants} className="h-full">
               <Link href={feature.href} className="h-full flex">
                <Card className="w-full text-left shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 h-full bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                    <CardDescription className="pt-1">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
               </Link>
              </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
