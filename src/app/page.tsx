import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Stats from '@/components/landing/stats';
import CallToAction from '@/components/landing/cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <CallToAction />
    </>
  );
}
