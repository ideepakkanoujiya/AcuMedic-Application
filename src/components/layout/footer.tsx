'use client';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function Footer({className}: {className?: string}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Do not render footer on pages that have their own full-screen layouts
  if (pathname === '/ai-assistant' || pathname.startsWith('/video/')) {
    return null;
  }

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">{t('footer.tagline')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:col-span-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">{t('footer.patients.title')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/symptom-checker" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.patients.symptomChecker')}</Link></li>
                <li><Link href="/ai-assistant" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.patients.aiAssistant')}</Link></li>
                <li><Link href="/doctors" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.patients.findDoctor')}</Link></li>
                <li><Link href="/book" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.patients.bookAppointment')}</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.patients.dashboard')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('footer.company.title')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.about')}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.contact')}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.company.careers')}</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-3">{t('footer.legal.title')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.legal.terms')}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.legal.privacy')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
