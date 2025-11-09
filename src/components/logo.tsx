import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

const CustomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M16 6C16 6 16 16 26 16" 
      className="stroke-primary" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M6 16C6 16 16 16 16 26" 
      className="stroke-primary" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);


export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
       <CustomLogo className="h-8 w-8" />
      <span className="text-xl font-bold tracking-tight text-foreground">AcuMedic</span>
    </Link>
  );
}
