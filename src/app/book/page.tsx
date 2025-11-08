'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [consultType, setConsultType] = useState<'clinic' | 'video'>('clinic');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  
  const doctor = {
    name: 'Dr. Emily Carter',
    specialty: 'Cardiologist',
    photoUrl: getPlaceholderImage('doctor-female-1')?.imageUrl || 'https://picsum.photos/seed/doc1/200/200',
  };

  const handleNextStep = () => {
    if (step === 2 && (!selectedDate || !selectedTime)) return;
    setStep(s => Math.min(s + 1, 3));
  };
  
  const handlePrevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  return (
    <div className="container mx-auto py-8 md:py-12 flex justify-center">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={doctor.photoUrl} alt={doctor.name} className="h-16 w-16 rounded-full border-2 border-primary" />
                <div>
                  <CardTitle className="text-2xl font-headline">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialty}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">Step {step} of 3</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-xl font-semibold mb-4">Choose Consultation Type</h3>
                <RadioGroup defaultValue="clinic" onValueChange={(value: 'clinic' | 'video') => setConsultType(value)} className="space-y-2">
                  <Label htmlFor="clinic" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="clinic" id="clinic" />
                    <div>
                      <p className="font-bold">In-Clinic Visit</p>
                      <p className="text-sm text-muted-foreground">Book an appointment at the doctor's clinic.</p>
                    </div>
                  </Label>
                  <Label htmlFor="video" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="video" id="video" />
                    <div>
                      <p className="font-bold">Video Consultation</p>
                      <p className="text-sm text-muted-foreground">Consult with the doctor from the comfort of your home.</p>
                    </div>
                  </Label>
                </RadioGroup>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-xl font-semibold mb-4">Select Date & Time</h3>
                 <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-center mb-2">Select Date</h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border p-0"
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-center mb-2">Select Time</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                      {timeSlots.map(slot => (
                        <Button 
                          key={slot} 
                          variant={selectedTime === slot ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot)}
                          className="w-full"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                 </div>
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
                 <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                 <h2 className="text-2xl font-bold font-headline">Appointment Confirmed!</h2>
                 <p className="text-muted-foreground mt-2">Your appointment with {doctor.name} is booked.</p>
                 <Card className="mt-6 text-left p-6 bg-muted/50">
                    <p><strong>Date:</strong> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Type:</strong> {consultType === 'clinic' ? 'In-Clinic Visit' : 'Video Consultation'}</p>
                 </Card>
                 <Button className="mt-6 w-full" asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
              </motion.div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              <div className="flex-grow" />
              {step < 3 && (
                <Button onClick={handleNextStep} disabled={step === 2 && (!selectedDate || !selectedTime)}>
                  {step === 2 ? 'Confirm Booking' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
