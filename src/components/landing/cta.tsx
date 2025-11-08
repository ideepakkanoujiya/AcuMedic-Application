import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-primary/5 dark:bg-primary/10">
      <div className="container py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Take Control of Your Health?</h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          Experience a smarter, simpler way to manage your healthcare. Get started with our AI assistant or find the right doctor for you today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/symptom-checker">Start AI Symptom Check</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/doctors">Find a Doctor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
