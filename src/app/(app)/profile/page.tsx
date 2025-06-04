'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  bio: z.string().max(200, "Bio cannot exceed 200 characters.").optional(),
  ecoPreferences: z.string().max(300, "Eco-preferences cannot exceed 300 characters.").optional(),
  newsletter: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Alex Green",
      email: "alex.green@example.com",
      bio: "Passionate about sustainable travel and exploring nature.",
      ecoPreferences: "Prefers locally-owned guesthouses, vegan food options, and low-impact activities.",
      newsletter: true,
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-headline text-primary">Your Profile</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Account Information</CardTitle>
          <CardDescription>Manage your personal details and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Image 
                  src="https://placehold.co/150x150.png" 
                  alt="User avatar" 
                  width={150} 
                  height={150} 
                  className="rounded-full shadow-md"
                  data-ai-hint="profile avatar" 
                />
                <Button variant="outline" type="button">Change Avatar</Button>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a bit about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ecoPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eco-Travel Preferences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., prefer train travel, avoid single-use plastics..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Subscribe to Newsletter
                      </FormLabel>
                      <CardDescription>
                        Receive updates on new features and sustainable travel tips.
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
              <CardFooter className="px-0">
                <Button type="submit" className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
