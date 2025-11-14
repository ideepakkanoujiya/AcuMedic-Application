'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Bell, User, Video, Bot } from 'lucide-react';
import Link from 'next/link';

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


export default function Dashboard() {
  const appointmentId = "appointment123"; // This should be dynamic in a real app

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">Patient Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back! Here's your health overview.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-primary/10 border-primary/20 flex flex-col md:flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Have a health question?</h3>
              <p className="text-muted-foreground">Chat with our AI Medical Assistant for instant answers.</p>
            </div>
          </div>
          <Button asChild className="mt-4 md:mt-0 w-full md:w-auto">
            <Link href="/ai-assistant">Start Chat</Link>
          </Button>
        </Card>
      </motion.div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="appointments" className="py-2"><Calendar className="mr-2 h-4 w-4"/>Appointments</TabsTrigger>
          <TabsTrigger value="reports" className="py-2"><FileText className="mr-2 h-4 w-4"/>Reports</TabsTrigger>
          <TabsTrigger value="reminders" className="py-2"><Bell className="mr-2 h-4 w-4"/>Reminders</TabsTrigger>
          <TabsTrigger value="profile" className="py-2"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Manage your upcoming consultations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <motion.div variants={itemVariants}>
                    <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <p className="font-bold">Dr. Emily Carter (Cardiologist)</p>
                            <p className="text-sm text-muted-foreground">Today, June 28, 2024 at 2:30 PM - <span className="text-primary font-medium">Video Consultation</span></p>
                        </div>
                         <div className="flex gap-2 w-full md:w-auto">
                            <Button asChild className="flex-1">
                                <Link href={`/video/${appointmentId}`}><Video className="mr-2 h-4 w-4"/>Join Video Call</Link>
                            </Button>
                            <Button variant="outline" asChild className="flex-1">
                              <Link href="/queue">Check Queue</Link>
                            </Button>
                        </div>
                    </Card>
                 </motion.div>
                 <motion.div variants={itemVariants}>
                    <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <p className="font-bold">Dr. Sarah Chen (Pediatrician)</p>
                            <p className="text-sm text-muted-foreground">July 15, 2024 at 10:00 AM - <span className="font-medium">In-Clinic Visit</span></p>
                        </div>
                        <Button variant="secondary" className="w-full md:w-auto">Reschedule</Button>
                    </Card>
                 </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
           <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Medical Reports</CardTitle>
                <CardDescription>Access your uploaded medical history and get AI-powered summaries.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
                  <p className="mt-1 text-sm max-w-sm mx-auto">Your uploaded medical reports will appear here. You can also get a simple summary of any report.</p>
                   <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
                    <Button variant="outline">Upload a Report</Button>
                    <Button asChild><Link href="/report-summarizer">Summarize a Report</Link></Button>
                   </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="reminders">
           <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preventive Care Reminders</CardTitle>
                <CardDescription>Stay on top of your health with timely reminders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Card className="p-4 flex justify-between items-center bg-blue-500/10 border-blue-500/20">
                    <div>
                        <p className="font-bold">Annual Blood Test</p>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Due: August 2024</p>
                    </div>
                    <Button variant="outline" size="sm">Mark as Done</Button>
                 </Card>
                  <Card className="p-4 flex justify-between items-center bg-green-500/10 border-green-500/20">
                    <div>
                        <p className="font-bold">Flu Vaccination</p>
                        <p className="text-sm text-green-900 dark:text-green-200">Recommended</p>
                    </div>
                    <Button variant="outline" size="sm">Schedule Now</Button>
                 </Card>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="profile">
           <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your personal information and settings.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <User className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">Profile Section</h3>
                  <p className="mt-1 text-sm max-w-xs mx-auto">Your personal information and account settings will be managed here.</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
