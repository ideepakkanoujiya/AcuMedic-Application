'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe, Check, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { LanguageContext, languages } from '@/context/language-context';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';


const navLinks = [
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/health-risk-assessment", label: "Risk Assessment" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/dashboard", label: "My Dashboard", auth: true },
];

export default function Header({className}: {className?: string}) {
  const pathname = usePathname();
  const { language, setLanguage } = useContext(LanguageContext);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  
  if (pathname === '/ai-assistant') {
    return null; // Don't render header on the chat page for a more immersive experience
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 ml-10">
          {navLinks.map(link => (
             (!link.auth || user) &&
            <Link key={link.href} href={link.href} className={cn(
              "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
              pathname === link.href && "text-primary"
              )}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map(lang => (
                <DropdownMenuItem key={lang.code} onSelect={() => setLanguage(lang.code)}>
                  <div className="flex items-center justify-between w-full">
                    <span>{lang.flag} {lang.name}</span>
                    {language === lang.code && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          
          {isUserLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <>
              <Button variant="ghost" asChild className="transition-colors">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="transition-transform duration-300 hover:scale-105">
                <Link href="/signup">Sign Up</Link>
              </Button>
             </>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 pt-10">
                  <Logo />
                  <nav className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    (!link.auth || user) &&
                    <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
