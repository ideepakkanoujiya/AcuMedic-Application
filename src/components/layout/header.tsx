'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe, Check, LogOut, ChevronDown } from 'lucide-react';
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
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';


export default function Header({className}: {className?: string}) {
  const pathname = usePathname();
  const { language, setLanguage } = useContext(LanguageContext);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { t } = useTranslation();

  // This is a mock role. In a real app, this would come from the user's profile in the database.
  const userRole = user ? (user.email?.includes('doctor') ? 'doctor' : 'patient') : null;

  const mainNavLinks = [
    { href: "/doctors", label: t('header.nav.findDoctor') },
    { href: "/dashboard", label: t('header.nav.myDashboard'), auth: true, role: 'patient' },
    { href: "/doctor/dashboard", label: t('header.nav.doctorPortal'), auth: true, role: 'doctor' },
  ];
  
  const aiToolsLinks = [
    { href: "/symptom-checker", label: t('header.aiTools.symptomChecker') },
    { href: "/health-risk-assessment", label: t('header.aiTools.riskAssessment') },
    { href: "/report-summarizer", label: t('header.aiTools.reportSummarizer')},
    { href: "/ai-assistant", label: t('header.aiTools.aiAssistant') },
  ]

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
  
  if (pathname.startsWith('/video/')) {
    return null; // Don't render header on video page
  }

  return (
    <div className="sticky top-0 z-50 h-24 w-full flex justify-center">
      <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            "absolute top-4 w-[95%] max-w-screen-2xl rounded-full border border-border/40 bg-background/80 shadow-lg backdrop-blur-sm", 
            className
          )}
        >
        <div className="container flex h-16 items-center">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 ml-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[state=open]:text-primary">
                  {t('header.aiTools.title')} <ChevronDown className="relative top-[1px] ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {aiToolsLinks.map(link => (
                  <DropdownMenuItem key={link.href} asChild>
                     <Link href={link.href} className={cn("w-full", pathname === link.href && "text-primary font-semibold")}>
                        {link.label}
                      </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {mainNavLinks.map(link => {
              if (link.auth) {
                // Show link if user is logged in and role matches, or if no role is specified
                return user && (!link.role || link.role === userRole) && (
                   <Link key={link.href} href={link.href} className={cn(
                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                    pathname.startsWith(link.href) && "text-primary"
                    )}>
                    {link.label}
                  </Link>
                )
              }
              // Show public links
              return (
                 <Link key={link.href} href={link.href} className={cn(
                    "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                    pathname.startsWith(link.href) && "text-primary"
                    )}>
                    {link.label}
                  </Link>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{t('header.toggleLanguage')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
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
                    <Link href={userRole === 'doctor' ? "/doctor/dashboard" : "/dashboard"}>{t('header.userMenu.dashboard')}</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=profile">{t('header.userMenu.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.userMenu.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                 <Button variant="ghost" asChild>
                    <Link href="/login">{t('header.nav.login')}</Link>
                </Button>
                <Button asChild className="transition-transform duration-300 hover:scale-105">
                    <Link href="/signup">{t('header.nav.getStarted')}</Link>
                </Button>
              </div>
            )}

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t('header.toggleMenu')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 pt-10">
                    <Logo />
                    <nav className="flex flex-col gap-4">
                    {[...aiToolsLinks, ...mainNavLinks].map(link => {
                       if (link.auth) {
                          return user && (!link.role || link.role === userRole) && (
                            <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                              {link.label}
                            </Link>
                          )
                       }
                       return (
                          <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                            {link.label}
                          </Link>
                       )
                    })}
                    </nav>
                     {!user && (
                        <div className="flex flex-col gap-2 mt-4">
                             <Button asChild className="w-full">
                                <Link href="/login">{t('header.nav.login')}</Link>
                            </Button>
                             <Button variant="outline" asChild className="w-full">
                                <Link href="/signup">{t('header.nav.signUp')}</Link>
                            </Button>
                        </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
