'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function QueuePage() {
    const [queuePosition, setQueuePosition] = useState(3);
    const [estimatedTime, setEstimatedTime] = useState(15);
    const [progress, setProgress] = useState(70);

    // Mock real-time updates
    useEffect(() => {
        const timer = setInterval(() => {
            setEstimatedTime(t => Math.max(0, t - 1));
            setProgress(p => Math.max(0, p - (100 / 15 / 60) * 100)); // Rough progress
        }, 60000); // update every minute

        return () => clearInterval(timer);
    }, []);

    const doctor = {
        name: 'Dr. Emily Carter',
        specialty: 'Cardiologist',
        photoUrl: getPlaceholderImage('doctor-female-1')?.imageUrl || 'https://picsum.photos/seed/doc1/200/200',
    };

    return (
        <div className="container mx-auto py-8 md:py-12 flex justify-center items-center min-h-[calc(100vh-8rem)]">
            <motion.div
                className="w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                <Card className="shadow-2xl text-center">
                    <CardHeader>
                        <div className="flex flex-col items-center gap-4">
                            <img src={doctor.photoUrl} alt={doctor.name} className="h-24 w-24 rounded-full border-4 border-primary" />
                            <div>
                                <CardTitle className="text-3xl font-headline">Live Queue Status</CardTitle>
                                <CardDescription className="text-base mt-1">with {doctor.name}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="bg-primary/10 border-primary/20 p-6">
                                <p className="text-lg">You are number</p>
                                <p className="text-7xl font-bold text-primary my-2">{queuePosition}</p>
                                <p className="text-lg">in the queue.</p>
                            </Card>
                        </motion.div>

                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="flex justify-between items-center text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    <span>Estimated Wait Time</span>
                                </div>
                                <span className="font-bold text-foreground">~{estimatedTime} min</span>
                            </div>
                            <Progress value={100 - (estimatedTime/15 * 100)} className="h-2" />
                            <div className="flex justify-between items-center text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Patients Ahead</span>
                                </div>
                                <span className="font-bold text-foreground">{queuePosition - 1}</span>
                            </div>
                        </motion.div>

                        <p className="text-xs text-muted-foreground pt-4">
                            Please keep this page open. We will notify you when it's your turn.
                            The waiting time is an estimate and may vary.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
