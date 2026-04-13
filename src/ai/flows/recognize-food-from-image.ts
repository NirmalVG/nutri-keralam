'use server';
/**
 * @fileOverview A Genkit flow for recognizing food items from an image and providing nutritional information.
 *
 * - recognizeFoodFromImage - A function that handles the food recognition process.
 * - RecognizeFoodFromImageInput - The input type for the recognizeFoodFromImage function.
 * - RecognizeFoodFromImageOutput - The return type for the recognizeFoodFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeFoodFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeFoodFromImageInput = z.infer<typeof RecognizeFoodFromImageInputSchema>;

const FoodItemSchema = z.object({
  name: z.string().describe('The name of the identified food item.'),
  description: z.string().describe('A brief description of the food item.'),
  calories: z.number().describe('Approximate calories for the identified portion.'),
  protein: z.number().describe('Approximate protein in grams for the identified portion.'),
  carbohydrates: z.number().describe('Approximate carbohydrates in grams for the identified portion.'),
  fat: z.number().describe('Approximate fat in grams for the identified portion.'),
  portionSize: z.string().describe('Estimated portion size (e.g., "1 cup", "medium serving").'),
});

const RecognizeFoodFromImageOutputSchema = z.object({
  foodItems: z.array(FoodItemSchema).describe('A list of identified food items with their nutritional information.'),
  overallAnalysis: z.string().describe('A brief overall analysis of the meal, mentioning its health aspects and suggesting improvements.'),
});
export type RecognizeFoodFromImageOutput = z.infer<typeof RecognizeFoodFromImageOutputSchema>;

export async function recognizeFoodFromImage(
  input: RecognizeFoodFromImageInput
): Promise<RecognizeFoodFromImageOutput> {
  return recognizeFoodFromImageFlow(input);
}

const recognizeFoodPrompt = ai.definePrompt({
  name: 'recognizeFoodPrompt',
  input: { schema: RecognizeFoodFromImageInputSchema },
  output: { schema: RecognizeFoodFromImageOutputSchema },
  prompt: `You are an expert nutritionist specialized in Indian cuisine.
Identify all food items present in the provided image of a meal.
For each food item, provide its name, a brief description, and approximate nutritional information (calories, protein, carbohydrates, fat) along with an estimated portion size.
Also, provide a brief overall analysis of the meal's health aspects, considering typical Indian dietary patterns and suggesting improvements or balance where needed.
The output MUST be in JSON format conforming to the provided schema.

Image: {{media url=imageDataUri}}`,
  config: {
    model: 'googleai/gemini-2.5-flash-image',
    responseModalities: ['TEXT'],
  },
});

const recognizeFoodFromImageFlow = ai.defineFlow(
  {
    name: 'recognizeFoodFromImageFlow',
    inputSchema: RecognizeFoodFromImageInputSchema,
    outputSchema: RecognizeFoodFromImageOutputSchema,
  },
  async (input) => {
    const {output} = await recognizeFoodPrompt(input);
    return output!;
  }
);
