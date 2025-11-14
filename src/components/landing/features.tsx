"use client";
import { Bot, Users, Video, FileText, HeartPulse, MessageSquareQuote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const featureIcons = {
  symptom: <Bot className="h-8 w-8 text-primary" />,
  queue: <Users className="h-8 w-8 text-primary" />,
  assistant: <Bot className="h-8 w-8 text-primary" />,
  tele: <Video className="h-8 w-8 text-primary" />,
  inCall: <MessageSquareQuote className="h-8 w-8 text-primary" />,
  risk: <HeartPulse className="h-8 w-8 text-primary" />,
  summarizer: <FileText className="h-8 w-8 text-primary" />,
}

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
  const { t } = useTranslation();

  const features = [
    {
      icon: featureIcons.symptom,
      title: t('features.symptom.title'),
      description: t('features.symptom.description'),
      href: "/symptom-checker",
    },
    {
      icon: featureIcons.queue,
      title: t('features.queue.title'),
      description: t('features.queue.description'),
      href: "/queue",
    },
    {
      icon: featureIcons.assistant,
      title: t('features.assistant.title'),
      description: t('features.assistant.description'),
      href: "/ai-assistant",
    },
    {
      icon: featureIcons.tele,
      title: t('features.tele.title'),
      description: t('features.tele.description'),
      href: "/dashboard",
    },
    {
      icon: featureIcons.inCall,
      title: t('features.inCall.title'),
      description: t('features.inCall.description'),
      href: "/dashboard",
    },
    {
      icon: featureIcons.risk,
      title: t('features.risk.title'),
      description: t('features.risk.description'),
      href: "/health-risk-assessment",
    },
    {
      icon: featureIcons.summarizer,
      title: t('features.summarizer.title'),
      description: t('features.summarizer.description'),
      href: "/report-summarizer",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-headline">{t('features.title')}</motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-muted-foreground md:text-lg">
            {t('features.subtitle')}
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
