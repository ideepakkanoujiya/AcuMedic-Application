'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Video, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';

const allDoctors = [
  {
    name: 'Dr. Emily Carter',
    specialty: 'Cardiologist',
    experience: 15,
    rating: 4.9,
    fee: 500,
    consultType: ['clinic', 'video'],
    photoUrl: getPlaceholderImage('doctor-female-1')?.imageUrl || '',
    photoHint: getPlaceholderImage('doctor-female-1')?.imageHint || 'doctor professional',
    availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
  },
  {
    name: 'Dr. Ben Hanson',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.8,
    fee: 450,
    consultType: ['video'],
    photoUrl: getPlaceholderImage('doctor-male-1')?.imageUrl || '',
    photoHint: getPlaceholderImage('doctor-male-1')?.imageHint || 'doctor professional',
    availableSlots: ['10:00 AM', '10:30 AM', '03:00 PM'],
  },
  {
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrician',
    experience: 12,
    rating: 4.9,
    fee: 400,
    consultType: ['clinic', 'video'],
    photoUrl: getPlaceholderImage('doctor-female-2')?.imageUrl || '',
    photoHint: getPlaceholderImage('doctor-female-2')?.imageHint || 'doctor smiling',
    availableSlots: ['09:30 AM', '11:00 AM', '01:00 PM', '03:30 PM'],
  },
    {
    name: 'Dr. Marcus Rodriguez',
    specialty: 'Orthopedic Surgeon',
    experience: 20,
    rating: 4.7,
    fee: 750,
    consultType: ['clinic'],
    photoUrl: getPlaceholderImage('doctor-male-2')?.imageUrl || '',
    photoHint: getPlaceholderImage('doctor-male-2')?.imageHint || 'doctor portrait',
    availableSlots: ['08:00 AM', '08:30 AM', '12:00 PM'],
  },
];

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


export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center font-headline">{t('doctors.title')}</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          {t('doctors.subtitle')}
        </p>

        <Card className="mb-8 p-4 shadow-sm bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative lg:col-span-2">
               <label htmlFor="search-doctor" className="text-sm font-medium text-muted-foreground">{t('doctors.searchLabel')}</label>
               <Search className="absolute left-3 bottom-3 h-5 w-5 text-muted-foreground" />
               <Input 
                  id="search-doctor" 
                  type="text" 
                  placeholder={t('doctors.searchPlaceholder')}
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div>
               <label htmlFor="location" className="text-sm font-medium text-muted-foreground">{t('doctors.locationLabel')}</label>
               <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('doctors.allLocations')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
            </div>
             <div>
               <label htmlFor="availability" className="text-sm font-medium text-muted-foreground">{t('doctors.availabilityLabel')}</label>
               <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('doctors.anyTime')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{t('doctors.today')}</SelectItem>
                    <SelectItem value="tomorrow">{t('doctors.tomorrow')}</SelectItem>
                    <SelectItem value="weekend">{t('doctors.thisWeekend')}</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredDoctors.map((doctor, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full flex flex-col overflow-hidden hover:border-primary transition-all shadow-md hover:shadow-primary/10 hover:-translate-y-1 transform duration-300">
              <CardContent className="p-6 text-center flex flex-col flex-grow">
                 <Image
                    src={doctor.photoUrl}
                    alt={`Photo of ${doctor.name}`}
                    width={100}
                    height={100}
                    data-ai-hint={doctor.photoHint}
                    className="rounded-full mx-auto mb-4 border-4 border-muted"
                 />
                <h3 className="text-xl font-bold font-headline">{doctor.name}</h3>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.experience} {t('doctors.yearsExperience')}</p>

                <div className="flex justify-center items-center gap-4 my-4">
                  <div className="flex items-center gap-1">
                     <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                     <span className="font-bold">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {doctor.consultType.includes('clinic') && <MapPin className="h-5 w-5 text-muted-foreground" title="In-Clinic"/>}
                    {doctor.consultType.includes('video') && <Video className="h-5 w-5 text-muted-foreground" title="Video Consult"/>}
                  </div>
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center justify-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {t('doctors.availableToday')}</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {doctor.availableSlots.slice(0, 4).map(slot => (
                        <Badge key={slot} variant="outline" className="text-primary border-primary/30 bg-primary/5">{slot}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full transition-transform duration-300 hover:scale-105" asChild>
                    <Link href="/book">{t('doctors.bookAppointment')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
