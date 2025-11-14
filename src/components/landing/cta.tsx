
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

export default function CallToAction() {
  const { t } = useTranslation();
  return (
    <section className="bg-primary/5 dark:bg-primary/10">
      <div className="container py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('cta.title')}</h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          {t('cta.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild className="transition-transform duration-300 hover:scale-105">
            <Link href="/symptom-checker">{t('cta.symptomCheck')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="transition-transform duration-300 hover:scale-105">
            <Link href="/doctors">{t('cta.findDoctor')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
