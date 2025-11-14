'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, DocumentReference } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-writes';

// Combined schema for User and DoctorProfile
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  specialty: z.string().min(1, 'Specialty is required'),
  teleconsultEnabled: z.boolean().default(false),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditDoctorProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid) as DocumentReference;
  }, [user, firestore]);

  const doctorProfileDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'doctor_profiles', user.uid) as DocumentReference;
  }, [user, firestore]);

  const { data: userData, isLoading: isUserLoadingData } = useDoc(userDocRef);
  const { data: doctorProfileData, isLoading: isProfileLoadingData } = useDoc(doctorProfileDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      specialty: '',
      teleconsultEnabled: false,
      bio: '',
    },
  });

  useEffect(() => {
    if (userData && doctorProfileData) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        specialty: doctorProfileData.specialty || '',
        teleconsultEnabled: doctorProfileData.teleconsultEnabled || false,
        bio: doctorProfileData.bio || '',
      });
    }
  }, [userData, doctorProfileData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userDocRef || !doctorProfileDocRef) return;

    try {
      // Update user document
      setDocumentNonBlocking(userDocRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }, { merge: true });

      // Update doctor profile document
      setDocumentNonBlocking(doctorProfileDocRef, {
        specialty: data.specialty,
        teleconsultEnabled: data.teleconsultEnabled,
        bio: data.bio,
      }, { merge: true });
      
      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
      router.push('/doctor/dashboard');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not save your profile. Please try again.',
      });
    }
  };

  const isLoading = isUserLoading || isUserLoadingData || isProfileLoadingData;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Edit Your Profile</CardTitle>
            <CardDescription>Keep your public profile and contact information up to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Emily" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Carter" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cardiologist" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Biography</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief introduction about your practice, experience, and philosophy." {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="teleconsultEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Accept Video Consultations</FormLabel>
                        <CardDescription>
                          Enable this to allow patients to book video calls with you.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
