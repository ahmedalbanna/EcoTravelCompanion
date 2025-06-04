'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Footprints, TrendingUp, Plane, Train, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const carbonTrackerSchema = z.object({
  transportMode: z.string().min(1, "Transport mode is required."),
  distance: z.number().min(0, "Distance must be positive.").positive("Distance must be positive."),
  roundTrip: z.boolean().optional(),
});

type CarbonTrackerFormValues = z.infer<typeof carbonTrackerSchema>;

interface CarbonEntry {
  id: string;
  date: string;
  transportMode: string;
  distance: number;
  footprint: number; // in kg CO2e
}

const chartConfig = {
  footprint: {
    label: "CO2e (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function CarbonTrackerPage() {
  const { toast } = useToast();
  const [calculatedFootprint, setCalculatedFootprint] = useState<number | null>(null);
  const [history, setHistory] = useState<CarbonEntry[]>([]);

  // Avoid hydration issues with Math.random or Date
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // Mock initial history data
    const mockHistory = [
      { id: '1', date: '2024-01-15', transportMode: 'Flight', distance: 2000, footprint: 400 },
      { id: '2', date: '2024-03-22', transportMode: 'Train', distance: 500, footprint: 20 },
      { id: '3', date: '2024-05-10', transportMode: 'Car (Petrol)', distance: 300, footprint: 54 },
    ];
    setHistory(mockHistory);
  }, []);


  const form = useForm<CarbonTrackerFormValues>({
    resolver: zodResolver(carbonTrackerSchema),
    defaultValues: {
      transportMode: "",
      distance: 0,
      roundTrip: false,
    },
  });

  // Simplified emission factors (kg CO2e per passenger-km)
  const emissionFactors: Record<string, number> = {
    'Flight (Short-haul)': 0.25,
    'Flight (Long-haul)': 0.15,
    'Train (National)': 0.04,
    'Train (Eurostar)': 0.01,
    'Car (Petrol)': 0.18,
    'Car (Electric)': 0.05, // Assuming average grid mix
    'Bus': 0.1,
  };

  function onSubmit(data: CarbonTrackerFormValues) {
    const factor = emissionFactors[data.transportMode] || 0.15; // Default to a flight-like factor if not found
    let footprint = data.distance * factor;
    if (data.roundTrip) {
      footprint *= 2;
    }
    setCalculatedFootprint(footprint);

    if (isClient) { // Only update history on client
        const newEntry: CarbonEntry = {
        id: Date.now().toString(), // Simple ID generation
        date: new Date().toISOString().split('T')[0],
        transportMode: data.transportMode,
        distance: data.distance * (data.roundTrip ? 2 : 1),
        footprint: parseFloat(footprint.toFixed(2)),
        };
        setHistory(prev => [...prev, newEntry].slice(-10)); // Keep last 10 entries
    }
    
    toast({
      title: "Footprint Calculated",
      description: `Your estimated carbon footprint for this trip is ${footprint.toFixed(2)} kg CO2e.`,
    });
  }

  const chartData = history.map(entry => ({
    month: new Date(entry.date).toLocaleString('default', { month: 'short' }), // Simplified for demo
    footprint: entry.footprint,
  }));


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-headline text-primary flex items-center gap-2"><Footprints /> Carbon Footprint Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Calculate Trip Emissions</CardTitle>
            <CardDescription>Estimate the carbon footprint of your travel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="transportMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Transport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(emissionFactors).map(mode => (
                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance (km, one way)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} onChange={event => field.onChange(+event.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="roundTrip"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Round Trip?</FormLabel>
                      </div>
                      <FormControl>
                        <Input 
                          type="checkbox" 
                          className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 w-full">Calculate Footprint</Button>
              </form>
            </Form>
          </CardContent>
          {calculatedFootprint !== null && (
            <CardFooter className="flex-col items-start">
              <h3 className="text-lg font-semibold mt-4">Estimated Footprint:</h3>
              <p className="text-2xl text-primary font-bold">{calculatedFootprint.toFixed(2)} kg CO<sub>2</sub>e</p>
              <p className="text-sm text-muted-foreground mt-2">This is an estimate. Actual emissions can vary.</p>
            </CardFooter>
          )}
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><TrendingUp className="text-accent"/> Your Carbon Journey</CardTitle>
            <CardDescription>Track your emissions over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && history.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="footprint" fill="var(--color-footprint)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No history to display yet. Calculate some trips!</p>
            )}
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold">Recent Trips:</h4>
              {isClient && history.slice(-3).reverse().map(entry => (
                 <div key={entry.id} className="text-sm p-2 border-b">
                   <p><strong>{entry.transportMode}</strong> ({entry.distance} km): {entry.footprint} kg CO2e on {entry.date}</p>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Tips for Reducing Your Footprint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><Plane className="inline h-4 w-4 mr-2 text-primary" />Choose direct flights when possible, or opt for trains for shorter distances.</p>
          <p><Train className="inline h-4 w-4 mr-2 text-primary" />Travel by train - it's often the most eco-friendly option for medium distances.</p>
          <p><Car className="inline h-4 w-4 mr-2 text-primary" />Consider electric vehicles or public transport over petrol cars.</p>
          <p><Footprints className="inline h-4 w-4 mr-2 text-primary" />Pack light! Heavier luggage means more fuel consumption.</p>
        </CardContent>
      </Card>
    </div>
  );
}
