import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Leaf, MapPinned, Footprints, Users2, Sparkles, Sprout, Library } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/icons/Logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Button asChild>
            <Link href="/trip-planner">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-b from-primary/10 to-background">
          <div className="container text-center">
            <Leaf className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              EcoTravel Companion
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-foreground/80 font-body">
              Your ultimate guide to sustainable and responsible travel. Plan eco-friendly trips, track your carbon footprint, and join a community of conscious explorers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/trip-planner">Start Planning</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resources">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="text-3xl font-headline font-semibold text-center mb-12 text-primary">
              Explore Our Features
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: MapPinned, title: 'Sustainable Trip Planner', description: 'Create itineraries with eco-friendly accommodations and activities.' },
                { icon: Footprints, title: 'Carbon Footprint Tracker', description: 'Understand and reduce your environmental impact.' },
                { icon: Users2, title: 'Community Platform', description: 'Connect with fellow eco-travelers and share experiences.' },
                { icon: Sparkles, title: 'AI Packing Assistant', description: 'Get smart, sustainable packing lists for your journey.' },
                { icon: Sprout, title: 'Local Eco-Experiences', description: 'Discover green businesses and sustainable local gems.' },
                { icon: Library, title: 'Educational Resources', description: 'Learn about sustainable travel practices.' },
              ].map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="items-center">
                    <feature.icon className="h-10 w-10 text-accent mb-3" />
                    <CardTitle className="font-headline text-xl text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 text-center font-body">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary/10">
          <div className="container text-center">
            <Image src="https://placehold.co/1200x400.png" alt="Scenic landscape" width={1200} height={400} className="rounded-lg mb-8 shadow-md mx-auto" data-ai-hint="travel landscape" />
            <h2 className="text-3xl font-headline font-semibold text-primary mb-6">
              Ready to Travel Sustainably?
            </h2>
            <p className="max-w-xl mx-auto text-foreground/80 mb-8 font-body">
              Join EcoTravel Companion today and make your next adventure a green one.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/profile">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container text-center text-muted-foreground text-sm font-body">
          &copy; {new Date().getFullYear()} EcoTravel Companion. Travel responsibly.
        </div>
      </footer>
    </div>
  );
}
