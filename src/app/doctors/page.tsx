'use client';

import { useState } from 'react';
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
import { Search, MapPin, Video, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const doctors = [
  {
    name: 'Dr. Emily Carter',
    specialty: 'Cardiologist',
    experience: 15,
    rating: 4.9,
    fee: 500,
    consultType: ['clinic', 'video'],
    photoUrl: 'https://picsum.photos/seed/doc1/200/200',
  },
  {
    name: 'Dr. Ben Hanson',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.8,
    fee: 450,
    consultType: ['video'],
    photoUrl: 'https://picsum.photos/seed/doc2/200/200',
  },
  {
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatrician',
    experience: 12,
    rating: 4.9,
    fee: 400,
    consultType: ['clinic', 'video'],
    photoUrl: 'https://picsum.photos/seed/doc3/200/200',
  },
    {
    name: 'Dr. Marcus Rodriguez',
    specialty: 'Orthopedic Surgeon',
    experience: 20,
    rating: 4.7,
    fee: 750,
    consultType: ['clinic'],
    photoUrl: 'https://picsum.photos/seed/doc4/200/200',
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
  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center font-headline">Find Your Doctor</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Search our network of top specialists and book your appointment today.
        </p>

        <Card className="mb-8 p-4 shadow-sm bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
               <label htmlFor="search-doctor" className="text-sm font-medium text-muted-foreground">Doctor/Specialty</label>
               <Search className="absolute left-3 bottom-3 h-5 w-5 text-muted-foreground" />
               <Input id="search-doctor" type="text" placeholder="e.g., Dr. Smith or Cardiologist" className="pl-10 h-11" />
            </div>
            <div>
               <label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location</label>
               <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                  </SelectContent>
                </Select>
            </div>
             <div>
               <label htmlFor="availability" className="text-sm font-medium text-muted-foreground">Availability</label>
               <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="weekend">This Weekend</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <Button size="lg" className="h-11 w-full">
              Search
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {doctors.map((doctor, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full overflow-hidden hover:border-primary transition-all shadow-md">
              <CardContent className="p-6 text-center">
                 <Image
                    src={doctor.photoUrl}
                    alt={`Photo of ${doctor.name}`}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4 border-4 border-muted"
                 />
                <h3 className="text-xl font-bold font-headline">{doctor.name}</h3>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.experience} years experience</p>

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
                 <Button className="w-full" asChild>
                  <Link href="/book">Book Appointment</Link>
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
