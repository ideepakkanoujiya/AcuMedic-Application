'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, ChevronRight, Video } from 'lucide-react';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const queuePatients = [
    { name: "Ananya Sharma", eta: 2, avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Vikram Singh", eta: 8, avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Priya Patel", eta: 15, avatar: "https://i.pravatar.cc/150?img=3" },
];


export default function DoctorDashboard() {
  const isLoadingRedirect = useAuthRedirect({ 
    redirectOn: 'no-auth', 
    redirectTo: '/login'
  });

  if (isLoadingRedirect) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">Doctor's Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, Doctor. Here's your overview for today.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> Today's Appointments</CardTitle>
                        <CardDescription>You have 5 appointments scheduled for today.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                                 <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?img=4" />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">Aarav Sen</p>
                                    <p className="text-sm text-muted-foreground">11:00 AM - Video Consultation</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button asChild className="flex-1">
                                    <Link href={`/video/session-aarav-sen`}><Video className="mr-2 h-4 w-4"/>Start Call</Link>
                                </Button>
                                <Button variant="outline" className="flex-1">View Details</Button>
                            </div>
                        </Card>
                         <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-60">
                            <div className="flex items-center gap-3">
                                 <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                                    <AvatarFallback>MV</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">Meera Varma</p>
                                    <p className="text-sm text-muted-foreground">11:30 AM - In-Clinic Visit</p>
                                </div>
                            </div>
                            <Button variant="secondary" disabled>Completed</Button>
                        </Card>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        {/* Sidebar column */}
        <div className="lg:col-span-1 space-y-8">
           <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Live Patient Queue</CardTitle>
                    <CardDescription>Manage patients waiting for consultation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {queuePatients.map((patient, index) => (
                        <Card key={index} className="p-3 flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={patient.avatar} />
                                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{patient.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> ETA: {patient.eta} min</p>
                                </div>
                            </div>
                            {index === 0 && <Button size="sm">Call Next</Button>}
                        </Card>
                    ))}
                     <Button variant="outline" className="w-full mt-2">
                        View Full Queue <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
