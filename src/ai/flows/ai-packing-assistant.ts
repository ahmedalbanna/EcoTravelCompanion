'use server';

/**
 * @fileOverview A packing list AI agent.
 *
 * - aiPackingAssistant - A function that handles the packing list generation process.
 * - AIPackingAssistantInput - The input type for the aiPackingAssistant function.
 * - AIPackingAssistantOutput - The return type for the aiPackingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPackingAssistantInputSchema = z.object({
  destination: z.string().describe('The destination of the trip.'),
  duration: z.string().describe('The duration of the trip (e.g., 3 days, 1 week).'),
  activities: z.string().describe('The planned activities during the trip (e.g., hiking, swimming, city tour).'),
  weather: z.string().describe('The expected weather conditions during the trip (e.g., sunny, rainy, cold).'),
  sustainabilityPreferences: z.string().describe('Any sustainability preferences (e.g., eco-friendly products, minimal waste).'),
});
export type AIPackingAssistantInput = z.infer<typeof AIPackingAssistantInputSchema>;

const AIPackingAssistantOutputSchema = z.object({
  packingList: z.string().describe('A list of items to pack for the trip, considering sustainability.'),
  recommendations: z.string().describe('Helpful recommendations for sustainable travel.'),
});
export type AIPackingAssistantOutput = z.infer<typeof AIPackingAssistantOutputSchema>;

export async function aiPackingAssistant(input: AIPackingAssistantInput): Promise<AIPackingAssistantOutput> {
  return aiPackingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPackingAssistantPrompt',
  input: {schema: AIPackingAssistantInputSchema},
  output: {schema: AIPackingAssistantOutputSchema},
  prompt: `You are an AI packing assistant that helps users create a packing list for their trip, considering sustainability.

  Destination: {{destination}}
  Duration: {{duration}}
  Activities: {{activities}}
  Weather: {{weather}}
  Sustainability Preferences: {{sustainabilityPreferences}}

  Generate a packing list for the trip, considering sustainability and providing helpful recommendations.
  `,
});

const aiPackingAssistantFlow = ai.defineFlow(
  {
    name: 'aiPackingAssistantFlow',
    inputSchema: AIPackingAssistantInputSchema,
    outputSchema: AIPackingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
