'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Users, Clock, Video, User, Search, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';

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

const allPatients = [
    { name: "Aarav Sen", lastVisit: "2024-06-28", avatar: "https://i.pravatar.cc/150?img=4" },
    { name: "Meera Varma", lastVisit: "2024-06-28", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Ananya Sharma", lastVisit: "2024-06-27", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Vikram Singh", lastVisit: "2024-06-26", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Priya Patel", lastVisit: "2024-06-25", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Rohan Joshi", lastVisit: "2024-06-22", avatar: "https://i.pravatar.cc/150?img=6" },
];

const TodaysView = () => (
    <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarIcon /> Today's Appointments</CardTitle>
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
        <div className="lg:col-span-1 space-y-8">
           <motion.div variants={itemVariants}>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Live Patient Queue</CardTitle>
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
                        Manage Full Queue
                    </Button>
                </CardContent>
            </Card>
           </motion.div>
        </div>
      </div>
)

const MyPatientsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPatients = allPatients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>My Patients</CardTitle>
                <CardDescription>Search and manage your patient records.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search patients..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map(patient => (
                            <TableRow key={patient.name}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={patient.avatar} />
                                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{patient.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">View Records</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


const ScheduleView = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    return (
         <Card className="mt-6">
            <CardHeader>
                <CardTitle>My Schedule</CardTitle>
                <CardDescription>View your appointments and manage your availability.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                 />
                 <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Appointments for {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                    <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                        <p>No appointments scheduled for this day.</p>
                        <Button variant="outline" className="mt-4">Block Time</Button>
                    </div>
                 </div>
            </CardContent>
        </Card>
    )
}

const ProfileView = () => (
     <Card className="mt-6">
        <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <FileEdit className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">Edit Your Profile</h3>
                <p className="mt-1 text-sm max-w-xs mx-auto">This is where you'll update your specialty, consultation fees, and other details patients see.</p>
                <Button variant="secondary" className="mt-4">Edit Profile Page (Coming Soon)</Button>
            </div>
        </CardContent>
    </Card>
)


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

       <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="today" className="py-2"><Clock className="mr-2 h-4 w-4"/>Today's View</TabsTrigger>
          <TabsTrigger value="patients" className="py-2"><Users className="mr-2 h-4 w-4"/>My Patients</TabsTrigger>
          <TabsTrigger value="schedule" className="py-2"><CalendarIcon className="mr-2 h-4 w-4"/>Schedule</TabsTrigger>
          <TabsTrigger value="profile" className="py-2"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
            <TodaysView />
        </TabsContent>

        <TabsContent value="patients">
            <MyPatientsView />
        </TabsContent>

        <TabsContent value="schedule">
            <ScheduleView />
        </TabsContent>
        
        <TabsContent value="profile">
            <ProfileView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
