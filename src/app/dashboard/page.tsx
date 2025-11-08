'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
              </CardHeader>
              <CardContent className="space-y-4">
                 <motion.div variants={itemVariants}>
                    <Card className="p-4 flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <p className="font-bold">Dr. Emily Carter (Cardiologist)</p>
                            <p className="text-sm text-muted-foreground">Today, June 28, 2024 at 2:30 PM - Video Consultation</p>
                        </div>
                         <div className="flex gap-2 mt-4 md:mt-0">
                            <Button>Join Video Call</Button>
                            <Button variant="outline">Check Queue</Button>
                        </div>
                    </Card>
                 </motion.div>
                 <motion.div variants={itemVariants}>
                    <Card className="p-4 flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <p className="font-bold">Annual Checkup</p>
                            <p className="text-sm text-muted-foreground">July 15, 2024 at 10:00 AM - In-Clinic</p>
                        </div>
                        <Button variant="secondary">Reschedule</Button>
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
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
                  <p className="mt-1 text-sm">Your uploaded medical reports will appear here.</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="reminders">
           <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preventive Care Reminders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Card className="p-4 flex justify-between items-center bg-blue-500/10 border-blue-500/20">
                    <div>
                        <p className="font-bold">Annual Blood Test</p>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Due: August 2024</p>
                    </div>
                    <Button variant="outline" size="sm">Mark as Done</Button>
                 </Card>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="profile">
           <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage your personal information and settings here.</p>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
