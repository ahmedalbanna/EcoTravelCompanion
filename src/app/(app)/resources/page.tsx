import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library, ExternalLink, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  dataAiHint: string;
  date: string;
  link: string; // External link for the resource
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Zero-Waste Travel',
    category: 'Packing',
    summary: 'Learn how to minimize your waste while exploring the world, with practical tips for every traveler.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'travel items',
    date: '2024-07-15',
    link: '#',
  },
  {
    id: '2',
    title: 'Choosing Eco-Friendly Accommodations',
    category: 'Accommodation',
    summary: 'What to look for when booking hotels, guesthouses, or rentals that prioritize sustainability.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'eco hotel',
    date: '2024-07-01',
    link: '#',
  },
  {
    id: '3',
    title: 'Reducing Your Carbon Footprint on Flights',
    category: 'Transport',
    summary: 'While flying is carbon-intensive, there are ways to make more informed choices and offset emissions.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'airplane wing',
    date: '2024-06-20',
    link: '#',
  },
  {
    id: '4',
    title: 'Supporting Local Communities While Traveling',
    category: 'Ethics',
    summary: 'Discover how to make a positive impact on the local economies and cultures you visit.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'local market',
    date: '2024-06-05',
    link: '#',
  },
  {
    id: '5',
    title: 'Sustainable Souvenir Shopping',
    category: 'Shopping',
    summary: 'Tips for finding meaningful, eco-friendly, and ethically sourced souvenirs.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'handicrafts souvenirs',
    date: '2024-05-25',
    link: '#',
  },
   {
    id: '6',
    title: 'The Importance of Water Conservation for Travelers',
    category: 'Environment',
    summary: 'Practical advice on how to conserve water during your travels, especially in water-scarce regions.',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'water drop',
    date: '2024-05-10',
    link: '#',
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <Library className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-headline text-primary">Educational Resources</h1>
        <p className="text-lg text-muted-foreground">Expand your knowledge on sustainable travel practices.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <Card key={resource.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image src={resource.imageUrl} alt={resource.title} width={400} height={250} className="w-full h-48 object-cover" data-ai-hint={resource.dataAiHint}/>
            <CardHeader className="p-4">
              <Badge variant="secondary" className="w-fit mb-2 bg-accent/20 text-accent font-semibold">{resource.category}</Badge>
              <CardTitle className="font-headline text-xl text-primary leading-tight">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <p className="text-sm text-foreground/80 line-clamp-3">{resource.summary}</p>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
              <div className="text-xs text-muted-foreground flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                {new Date(resource.date).toLocaleDateString()}
              </div>
              <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center">
                Read More <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
