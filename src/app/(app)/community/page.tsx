'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Users2, MessageSquare, ThumbsUp, Send, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const postSchema = z.object({
  content: z.string().min(10, "Post must be at least 10 characters.").max(500, "Post cannot exceed 500 characters."),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CommunityPost {
  id: string;
  author: string;
  avatarUrl: string;
  dataAiHint: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
  imageUrl?: string;
  imageAiHint?: string;
}

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'EcoExplorer Jane',
    avatarUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'woman smiling',
    timestamp: '2 hours ago',
    content: 'Just returned from an amazing trip to the Cloud Forest in Monteverde, Costa Rica! The biodiversity was breathtaking. Stayed at a wonderful eco-lodge that practices rainwater harvesting. Highly recommend!',
    likes: 25,
    comments: 5,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'forest canopy'
  },
  {
    id: '2',
    author: 'Sustainable Sam',
    avatarUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'man hiking',
    timestamp: '5 hours ago',
    content: 'Found this great zero-waste store in Kyoto during my travels. They had everything from bamboo toothbrushes to package-free snacks. It’s inspiring to see such initiatives worldwide!',
    likes: 42,
    comments: 8,
  },
  {
    id: '3',
    author: 'GreenGlobetrotter',
    avatarUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'person beach',
    timestamp: '1 day ago',
    content: 'Any tips for eco-friendly snorkeling tours in the Great Barrier Reef? Looking for operators that prioritize coral conservation.',
    likes: 15,
    comments: 12,
  },
];

export default function CommunityPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  
  // Avoid hydration mismatch for posts and avatars
  useEffect(() => {
    setPosts(initialPosts);
  }, []);


  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(data: PostFormValues) {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: 'Current User', // Replace with actual user later
      avatarUrl: 'https://placehold.co/40x40.png',
      dataAiHint: 'person avatar',
      timestamp: 'Just now',
      content: data.content,
      likes: 0,
      comments: 0,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    form.reset();
    toast({
      title: "Post Shared!",
      description: "Your travel experience has been shared with the community.",
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <Users2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-headline text-primary">Community Hub</h1>
        <p className="text-lg text-muted-foreground">Connect, share, and learn with fellow eco-travelers.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Edit3 className="text-accent" /> Share Your Story</CardTitle>
          <CardDescription>Inspire others with your sustainable travel experiences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="What eco-friendly adventures have you been on?"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" /> Post
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-3xl font-headline text-primary">Recent Posts</h2>
        {posts.map(post => (
          <Card key={post.id} className="shadow-md">
            <CardHeader className="flex flex-row items-center space-x-3 p-4">
              <Avatar>
                <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint={post.dataAiHint}/>
                <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-primary">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.timestamp}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-foreground/90 whitespace-pre-line">{post.content}</p>
              {post.imageUrl && (
                <div className="mt-4">
                  <Image src={post.imageUrl} alt="Post image" width={600} height={400} className="rounded-lg object-cover w-full max-h-[400px]" data-ai-hint={post.imageAiHint}/>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 flex items-center space-x-6 bg-muted/50">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ThumbsUp className="h-4 w-4 mr-1.5" /> {post.likes} Likes
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageSquare className="h-4 w-4 mr-1.5" /> {post.comments} Comments
              </Button>
            </CardFooter>
          </Card>
        ))}
         {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No posts yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
}
