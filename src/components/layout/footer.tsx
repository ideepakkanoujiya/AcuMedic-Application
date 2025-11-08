import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">Intelligent Medical Triage & Appointment Booking System.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:col-span-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Patients</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ai-assistant" className="text-muted-foreground hover:text-foreground transition-colors">Symptom Checker</Link></li>
                <li><Link href="/doctors" className="text-muted-foreground hover:text-foreground transition-colors">Find a Doctor</Link></li>
                <li><Link href="/appointments" className="text-muted-foreground hover:text-foreground transition-colors">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Doctors</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/doctors" className="text-muted-foreground hover:text-foreground transition-colors">Join our network</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Doctor Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MediQ AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
