'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, MapPin, BedDouble, Utensils, Trees, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";

const tripPlannerSchema = z.object({
  destination: z.string().min(1, "Destination is required."),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
  travelers: z.number().min(1, "At least one traveler is required.").positive(),
  notes: z.string().optional(),
});

type TripPlannerFormValues = z.infer<typeof tripPlannerSchema>;

interface ItineraryItem {
  id: string;
  day: number;
  type: 'accommodation' | 'activity' | 'dining';
  name: string;
  description: string;
  ecoRating: number; // 1-5
}

export default function TripPlannerPage() {
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [currentItineraryItem, setCurrentItineraryItem] = useState({ day: 1, type: 'activity', name: '', description: '', ecoRating: 3 });
  
  // Avoid hydration mismatch for dates
  const [initialDates, setInitialDates] = useState<{ startDate?: Date; endDate?: Date }>({});
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setInitialDates({ startDate: today, endDate: tomorrow });
  }, []);


  const form = useForm<TripPlannerFormValues>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      destination: "",
      travelers: 1,
      notes: "",
    },
  });
  
  // Update defaultValues when initialDates is ready
  useEffect(() => {
    if (initialDates.startDate && initialDates.endDate) {
      form.reset({
        ...form.getValues(),
        startDate: initialDates.startDate,
        endDate: initialDates.endDate,
      });
    }
  }, [initialDates, form]);


  function onSubmit(data: TripPlannerFormValues) {
    console.log(data);
    toast({
      title: "Trip Saved!",
      description: `Your trip to ${data.destination} has been saved.`,
    });
  }

  const addItineraryItem = () => {
    if (!currentItineraryItem.name.trim()) {
      toast({ title: "Error", description: "Item name cannot be empty.", variant: "destructive" });
      return;
    }
    setItinerary([...itinerary, { ...currentItineraryItem, id: Date.now().toString() }]);
    setCurrentItineraryItem({ day: 1, type: 'activity', name: '', description: '', ecoRating: 3 }); // Reset form
  };

  const removeItineraryItem = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const suggestedExperiences = [
    { id: '1', name: 'Eco-Lodge Amazonia', type: 'Accommodation', rating: 5, image: 'https://placehold.co/300x200.png', dataAiHint: 'eco lodge' },
    { id: '2', 'name': 'Guided Nature Hike', type: 'Activity', rating: 4, image: 'https://placehold.co/300x200.png', dataAiHint: 'nature hike' },
    { id: '3', 'name': "Farm-to-Table Dining Experience", type: 'Dining', rating: 5, image: 'https://placehold.co/300x200.png', dataAiHint: 'farm dining' },
  ];

  if (!initialDates.startDate) {
    return <div className="container mx-auto p-4 md:p-8 space-y-8">Loading planner...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-headline text-primary">Sustainable Trip Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><MapPin className="text-accent"/> Plan Your Journey</CardTitle>
              <CardDescription>Enter your trip details to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Costa Rica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < (form.getValues("startDate") || new Date(new Date().setHours(0,0,0,0)))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} onChange={event => field.onChange(+event.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any specific requirements or interests?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Save Trip Details</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><PlusCircle className="text-accent"/>Add to Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" value={currentItineraryItem.name} onChange={(e) => setCurrentItineraryItem({...currentItineraryItem, name: e.target.value})} placeholder="e.g., Visit National Park"/>
              </div>
              <div>
                <Label htmlFor="itemDesc">Description</Label>
                <Textarea id="itemDesc" value={currentItineraryItem.description} onChange={(e) => setCurrentItineraryItem({...currentItineraryItem, description: e.target.value})} placeholder="Details about the activity/place"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemDay">Day</Label>
                  <Input id="itemDay" type="number" value={currentItineraryItem.day} onChange={(e) => setCurrentItineraryItem({...currentItineraryItem, day: parseInt(e.target.value) || 1})} min="1"/>
                </div>
                <div>
                  <Label htmlFor="itemType">Type</Label>
                  <select id="itemType" value={currentItineraryItem.type} onChange={(e) => setCurrentItineraryItem({...currentItineraryItem, type: e.target.value as any})} className="w-full p-2 border rounded-md">
                    <option value="activity">Activity</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="dining">Dining</option>
                  </select>
                </div>
              </div>
               <div>
                  <Label htmlFor="itemEcoRating">Eco Rating (1-5)</Label>
                  <Input id="itemEcoRating" type="number" value={currentItineraryItem.ecoRating} onChange={(e) => setCurrentItineraryItem({...currentItineraryItem, ecoRating: Math.max(1, Math.min(5, parseInt(e.target.value)))})} min="1" max="5"/>
                </div>
              <Button onClick={addItineraryItem} className="bg-accent hover:bg-accent/90 text-accent-foreground">Add Item</Button>
            </CardContent>
          </Card>
          
          {itinerary.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {itinerary.sort((a,b) => a.day - b.day).map(item => (
                  <div key={item.id} className="mb-4 p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name} (Day {item.day})</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.type} - Eco Rating: {item.ecoRating}/5</p>
                        <p className="mt-1">{item.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItineraryItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><Trees className="text-accent"/>Eco-Friendly Suggestions</CardTitle>
              <CardDescription>Consider these sustainable options for your trip.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedExperiences.map(exp => (
                <Card key={exp.id} className="overflow-hidden">
                  <Image src={exp.image} alt={exp.name} width={300} height={200} className="w-full h-40 object-cover" data-ai-hint={exp.dataAiHint} />
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-headline">{exp.name}</CardTitle>
                    <CardDescription>{exp.type} - Rating: {exp.rating}/5</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4">
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
