'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Luggage, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import { aiPackingAssistant, type AIPackingAssistantInput, type AIPackingAssistantOutput } from '@/ai/flows/ai-packing-assistant';

const packingAssistantSchema = z.object({
  destination: z.string().min(1, "Destination is required."),
  duration: z.string().min(1, "Duration is required (e.g., 3 days, 1 week)."),
  activities: z.string().min(1, "Activities are required (e.g., hiking, swimming)."),
  weather: z.string().min(1, "Expected weather is required (e.g., sunny, rainy)."),
  sustainabilityPreferences: z.string().optional(),
});

type PackingAssistantFormValues = z.infer<typeof packingAssistantSchema>;

export default function PackingAssistantPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState<AIPackingAssistantOutput | null>(null);

  const form = useForm<PackingAssistantFormValues>({
    resolver: zodResolver(packingAssistantSchema),
    defaultValues: {
      destination: "",
      duration: "",
      activities: "",
      weather: "",
      sustainabilityPreferences: "Eco-friendly products, minimal waste.",
    },
  });

  async function onSubmit(data: PackingAssistantFormValues) {
    setIsLoading(true);
    setAssistantResponse(null);
    try {
      const input: AIPackingAssistantInput = {
        destination: data.destination,
        duration: data.duration,
        activities: data.activities,
        weather: data.weather,
        sustainabilityPreferences: data.sustainabilityPreferences || "None specified",
      };
      const response = await aiPackingAssistant(input);
      setAssistantResponse(response);
      toast({
        title: "Packing List Generated!",
        description: "Your AI assistant has prepared a packing list.",
      });
    } catch (error) {
      console.error("Error generating packing list:", error);
      toast({
        title: "Error",
        description: "Failed to generate packing list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <Luggage className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-headline text-primary">AI Packing Assistant</h1>
        <p className="text-lg text-muted-foreground">Get a personalized and sustainable packing list for your next trip.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wand2 className="text-accent" />Tell Us About Your Trip</CardTitle>
            <CardDescription>Provide details so our AI can create the perfect packing list.</CardDescription>
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
                        <Input placeholder="e.g., Bali, Indonesia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 7 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planned Activities</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., hiking, swimming, city tours, relaxing on the beach" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weather"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Weather</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., sunny and warm, occasional rain" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sustainabilityPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sustainability Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., prefer natural fiber clothing, reusable items" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Packing List"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {assistantResponse ? (
            <>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Your Packing List</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-body text-sm bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto">{assistantResponse.packingList}</pre>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Sustainable Travel Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-body text-sm bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto">{assistantResponse.recommendations}</pre>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-lg h-full flex flex-col items-center justify-center">
              <CardContent className="text-center">
                <Luggage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your packing list and recommendations will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
