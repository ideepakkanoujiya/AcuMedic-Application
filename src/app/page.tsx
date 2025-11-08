import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Stats from '@/components/landing/stats';
import CallToAction from '@/components/landing/cta';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
