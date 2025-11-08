import { Bot, CalendarCheck, Users, Video } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI Symptom Checker",
    description: "Get an initial diagnosis and recommendation from our advanced AI.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: "Instant Booking",
    description: "Book appointments with top specialists in just a few clicks.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Live Queue Tracking",
    description: "Track your queue position and wait time in real-time. No more guessing.",
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Video Consultations",
    description: "Consult with doctors from the comfort and privacy of your home.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">A New Era of Healthcare</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            MediQ AI combines cutting-edge technology with compassionate care to bring you a seamless healthcare experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-2">
              <CardHeader className="items-center p-6">
                {feature.icon}
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
