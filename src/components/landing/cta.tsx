import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Take Control of Your Health?</h2>
        <p className="mt-4 max-w-xl mx-auto">
          Join thousands of others who are experiencing a smarter, simpler way to manage their health.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Get Started Now</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link href="/doctors">I'm a Doctor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
