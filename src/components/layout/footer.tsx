'use client';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Footer({className}: {className?: string}) {
  const pathname = usePathname();

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
            <p className="text-sm text-muted-foreground max-w-xs">Your intelligent health partner, available 24/7.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:col-span-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Patients</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/symptom-checker" className="text-muted-foreground hover:text-foreground transition-colors">Symptom Checker</Link></li>
                <li><Link href="/ai-assistant" className="text-muted-foreground hover:text-foreground transition-colors">AI Assistant</Link></li>
                <li><Link href="/doctors" className="text-muted-foreground hover:text-foreground transition-colors">Find a Doctor</Link></li>
                <li><Link href="/book" className="text-muted-foreground hover:text-foreground transition-colors">Book Appointment</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">My Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AcuMedic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
