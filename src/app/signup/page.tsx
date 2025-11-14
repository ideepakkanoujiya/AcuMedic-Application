'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-writes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['patient', 'doctor']),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const isLoadingRedirect = useAuthRedirect({ 
    redirectOn: 'auth', 
    patientRedirectTo: '/dashboard',
    doctorRedirectTo: '/doctor/dashboard'
  });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Step 2: Update user's profile in Firebase Auth
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      
      // Step 3: Create a user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: '', // Initially empty
      };
      
      setDocumentNonBlocking(userDocRef, userData, { merge: true });

      // Step 4 (For Doctors): Create a doctor profile document
      if (data.role === 'doctor') {
        const doctorProfileRef = doc(firestore, 'doctor_profiles', user.uid);
        const doctorProfileData = {
            userId: user.uid,
            specialty: "General Medicine", // Default specialty
            teleconsultEnabled: true,
            clinics: [],
            ratings: 0,
        };
        setDocumentNonBlocking(doctorProfileRef, doctorProfileData, { merge: true });
      }

      toast({
        title: 'Account Created',
        description: "Welcome to AcuMedic! We're redirecting you...",
      });
      // Redirect is handled by useAuthRedirect hook
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };
  
  if (isLoadingRedirect) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>Join AcuMedic to manage your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
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
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </Form>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
