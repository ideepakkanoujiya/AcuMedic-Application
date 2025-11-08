'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isSimpleLayout = pathname === '/ai-assistant';

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header className={cn(isSimpleLayout ? "hidden" : "")}/>
            <main className="flex-1">{children}</main>
            <Footer className={cn(isSimpleLayout ? "hidden" : "")}/>
        </div>
    )
}
