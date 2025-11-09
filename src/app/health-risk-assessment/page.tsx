'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, HeartPulse, Target, ShieldCheck, BarChart3 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { predictHealthRisk, PredictiveHealthRiskOutput } from '@/ai/flows/predictive-health-risk-flow';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Age must be at least 18').max(100),
  gender: z.enum(['male', 'female', 'other']),
  bmi: z.coerce.number().min(10, 'BMI seems too low').max(50, 'BMI seems too high'),
  systolic: z.coerce.number().min(70).max(250),
  diastolic: z.coerce.number().min(40).max(150),
  totalCholesterol: z.coerce.number().min(100).max(400),
  hdl: z.coerce.number().min(20).max(100),
  hasDiabetes: z.boolean().default(false),
  isSmoker: z.boolean().default(false),
  weeklyExercise: z.coerce.number().min(0).max(1000),
});

type FormValues = z.infer<typeof formSchema>;

const RiskResultDisplay = ({ results }: { results: PredictiveHealthRiskOutput }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 />10-Year Risk Profile</CardTitle>
          <CardDescription>
            This is an AI-powered forecast, not a diagnosis. Consult a doctor to discuss these results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.riskScores.map(risk => (
            <div key={risk.condition}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{risk.condition}</span>
                <Badge variant={
                  risk.level === 'low' ? 'default' : risk.level === 'moderate' ? 'secondary' : 'destructive'
                } className="capitalize">{risk.level.replace('-', ' ')}</Badge>
              </div>
              <Progress value={risk.percentage} className="h-3" indicatorClassName={getRiskColor(risk.level)} />
              <p className="text-right text-sm text-muted-foreground mt-1">{risk.percentage}% Risk</p>
            </div>
          ))}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target />Key Influencing Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.keyFactors.map(factor => (
            <div key={factor.factor} className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold">{factor.factor}</p>
              <p className="text-sm text-muted-foreground">{factor.impact}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck />Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           {results.recommendations.map(rec => (
            <div key={rec.area} className="p-3 bg-primary/10 rounded-lg">
              <p className="font-semibold text-primary">{rec.area}</p>
              <p className="text-sm text-primary-foreground/80">{rec.suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="bg-blue-900/10 border-blue-500/20">
         <CardHeader>
          <CardTitle className="text-blue-200">Summary & Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-300">{results.overallSummary}</p>
          <Button className="mt-4 w-full" asChild><a href="/doctors">Find a Specialist</a></Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};


export default function HealthRiskAssessmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictiveHealthRiskOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 35,
      gender: 'male',
      bmi: 24.5,
      systolic: 120,
      diastolic: 80,
      totalCholesterol: 200,
      hdl: 50,
      hasDiabetes: false,
      isSmoker: false,
      weeklyExercise: 150,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await predictHealthRisk({
        age: data.age,
        gender: data.gender,
        bmi: data.bmi,
        bloodPressure: { systolic: data.systolic, diastolic: data.diastolic },
        cholesterol: { total: data.totalCholesterol, hdl: data.hdl },
        hasDiabetes: data.hasDiabetes,
        isSmoker: data.isSmoker,
        weeklyExercise: data.weeklyExercise,
      });
      setResults(result);
    } catch (error) {
      console.error("Error predicting health risk:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI model could not process your data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setResults(null);
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">Predictive Health Risk Assessment</h1>
        <p className="text-muted-foreground mb-8">
          Enter your health metrics to receive an AI-powered forecast of your long-term health risks.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Your Health Profile</CardTitle>
              <CardDescription>All data is processed securely and is not stored.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 45" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="bmi" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Mass Index (BMI)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="e.g., 24.5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <div className="space-y-2">
                      <FormLabel>Blood Pressure (Systolic/Diastolic)</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="systolic" render={({ field }) => (
                            <FormItem><FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="diastolic" render={({ field }) => (
                            <FormItem><FormControl><Input type="number" placeholder="e.g., 80" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                   </div>
                    <div className="space-y-2">
                      <FormLabel>Cholesterol (Total/HDL)</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="totalCholesterol" render={({ field }) => (
                            <FormItem><FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="hdl" render={({ field }) => (
                            <FormItem><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                   </div>
                   <FormField control={form.control} name="weeklyExercise" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Exercise (minutes)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <FormField control={form.control} name="isSmoker" render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                                <FormLabel className="cursor-pointer">Are you a smoker?</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                         <FormField control={form.control} name="hasDiabetes" render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                                <FormLabel className="cursor-pointer">History of Diabetes?</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                         )} />
                    </div>

                  {results ? (
                    <Button onClick={handleReset} variant="outline" className="w-full">Start Over</Button>
                  ) : (
                    <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Calculate My Risk'}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <Card className="flex flex-col items-center justify-center text-center py-12 px-6 min-h-[400px] shadow-lg">
              <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
              <h3 className="mt-6 text-xl font-semibold">Running Predictive Analysis...</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">Our AI is processing your health profile. This may take a moment.</p>
            </Card>
          ) : results ? (
            <RiskResultDisplay results={results} />
          ) : (
            <Card className="flex flex-col items-center justify-center text-center py-12 px-6 min-h-[400px] shadow-lg bg-gradient-to-br from-card to-muted/30">
              <img src="/images/placeholder/dna-strand.svg" alt="Health Prediction" className="h-24 w-24 opacity-20" />
              <h3 className="mt-6 text-xl font-semibold">Your Future Health Insights</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">Your personalized risk forecast and recommendations will appear here after you submit your profile.</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
