'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Search, Star, MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EcoExperience {
  id: string;
  name: string;
  category: 'Accommodation' | 'Dining' | 'Activity' | 'Shop';
  location: string;
  description: string;
  sustainabilityRating: number; // 1-5
  image: string;
  dataAiHint: string;
}

const allExperiences: EcoExperience[] = [
  { id: '1', name: 'Green Haven Eco-Lodge', category: 'Accommodation', location: 'Forest Region', description: 'Stay in beautiful cabins powered by solar energy.', sustainabilityRating: 5, image: 'https://placehold.co/400x250.png', dataAiHint: 'eco lodge' },
  { id: '2', name: 'The Conscious Cafe', category: 'Dining', location: 'City Center', description: 'Organic, locally-sourced vegan and vegetarian meals.', sustainabilityRating: 4, image: 'https://placehold.co/400x250.png', dataAiHint: 'cafe interior' },
  { id: '3', name: 'River Kayaking Adventure', category: 'Activity', location: 'River Valley', description: 'Guided kayaking tours with a focus on wildlife conservation.', sustainabilityRating: 4, image: 'https://placehold.co/400x250.png', dataAiHint: 'kayaking river' },
  { id: '4', name: 'Artisan Earth Goods', category: 'Shop', location: 'Old Town', description: 'Handmade, fair-trade crafts and eco-friendly products.', sustainabilityRating: 5, image: 'https://placehold.co/400x250.png', dataAiHint: 'artisan shop' },
  { id: '5', name: 'Sustainable Farm Stay', category: 'Accommodation', location: 'Countryside', description: 'Experience life on an organic farm with fresh produce.', sustainabilityRating: 5, image: 'https://placehold.co/400x250.png', dataAiHint: 'farm house' },
  { id: '6', name: 'Zero-Waste Eatery', category: 'Dining', location: 'Urban Area', description: 'Delicious meals with a commitment to zero food waste.', sustainabilityRating: 5, image: 'https://placehold.co/400x250.png', dataAiHint: 'modern restaurant' },
];

export default function EcoExperiencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [filteredExperiences, setFilteredExperiences] = useState<EcoExperience[]>(allExperiences);

  useEffect(() => {
    let experiences = allExperiences;
    if (searchTerm) {
      experiences = experiences.filter(exp => exp.name.toLowerCase().includes(searchTerm.toLowerCase()) || exp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter !== "All") {
      experiences = experiences.filter(exp => exp.category === categoryFilter);
    }
    if (ratingFilter > 0) {
      experiences = experiences.filter(exp => exp.sustainabilityRating >= ratingFilter);
    }
    setFilteredExperiences(experiences);
  }, [searchTerm, categoryFilter, ratingFilter]);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <Sprout className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-headline text-primary">Local Eco-Experiences</h1>
        <p className="text-lg text-muted-foreground">Discover sustainable businesses and activities.</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search experiences..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Dining">Dining</SelectItem>
                <SelectItem value="Activity">Activity</SelectItem>
                <SelectItem value="Shop">Shop</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map(exp => (
            <Card key={exp.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <Image src={exp.image} alt={exp.name} width={400} height={250} className="w-full h-52 object-cover" data-ai-hint={exp.dataAiHint} />
              <CardHeader className="p-4">
                <CardTitle className="font-headline text-xl text-primary">{exp.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" /> {exp.location}
                </div>
                <CardDescription className="text-sm text-accent font-semibold">{exp.category}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <p className="text-sm text-foreground/80 mb-2">{exp.description}</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-5 w-5", i < exp.sustainabilityRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">({exp.sustainabilityRating})</span>
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No experiences match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
