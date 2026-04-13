'use server';
/**
 * @fileOverview A Genkit flow for generating personalized 3-day Indian meal plans.
 *
 * - generateAIMealPlan - A function that handles the meal plan generation process.
 * - GenerateAIMealPlanInput - The input type for the generateAIMealPlan function.
 * - GenerateAIMealPlanOutput - The return type for the generateAIMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateAIMealPlanInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .describe('User dietary preferences (e.g., vegetarian, vegan, low-carb, no dairy).'),
  healthGoals: z
    .string()
    .describe('User health goals (e.g., weight loss, muscle gain, maintain weight, blood sugar control).'),
  healthConditions: z
    .string()
    .optional()
    .describe('Optional user health conditions (e.g., diabetes, PCOS, hypothyroidism, no nuts).'),
  language: z
    .string()
    .describe('The Indian language for the meal plan and advice (e.g., English, Hindi, Malayalam, Tamil).'),
});
export type GenerateAIMealPlanInput = z.infer<typeof GenerateAIMealPlanInputSchema>;

// Output Schema
const MealSchema = z.object({
  name: z.string().describe('The name of the dish.'),
  description: z.string().describe('A brief description of the meal.'),
  ingredients: z.array(z.string()).describe('A list of key ingredients for the meal.'),
  calories: z.number().describe('Estimated calorie count for the meal.'),
  macronutrients: z.object({
    protein: z.number().describe('Protein content in grams.'),
    carbohydrates: z.number().describe('Carbohydrate content in grams.'),
    fats: z.number().describe('Fat content in grams.'),
  }).describe('Estimated macronutrient breakdown.'),
});

const DayMealPlanSchema = z.object({
  day: z.string().describe('e.g., "Day 1"'),
  meals: z.object({
    breakfast: MealSchema,
    lunch: MealSchema,
    dinner: MealSchema,
    snacks: z.array(MealSchema).describe('Optional snacks for the day. Can be empty.'),
  }),
});

const GenerateAIMealPlanOutputSchema = z.object({
  mealPlan: z.array(DayMealPlanSchema).describe('A 3-day personalized Indian meal plan.'),
  nutritionalAdvice: z.string().describe('General nutritional advice based on goals and preferences.'),
  disclaimer: z.string().describe('A disclaimer regarding the AI-generated advice.'),
});
export type GenerateAIMealPlanOutput = z.infer<typeof GenerateAIMealPlanOutputSchema>;

// Wrapper function
export async function generateAIMealPlan(
  input: GenerateAIMealPlanInput
): Promise<GenerateAIMealPlanOutput> {
  return generateAIMealPlanFlow(input);
}

// Prompt definition
const generateAIMealPlanPrompt = ai.definePrompt({
  name: 'generateAIMealPlanPrompt',
  input: {schema: GenerateAIMealPlanInputSchema},
  output: {schema: GenerateAIMealPlanOutputSchema},
  prompt: `You are an AI-powered personalized diet coach specializing in authentic Indian cuisine and nutrition. Your task is to generate a 3-day meal plan tailored to the user's specific needs.

**Instructions for the meal plan:**
- Focus exclusively on authentic Indian dishes.
- Tailor the meal plan to the user's dietary preferences, health goals, and any specified health conditions.
- For each meal (breakfast, lunch, dinner, snacks), provide a "name", "description", a list of "ingredients", estimated "calories", and a detailed "macronutrients" breakdown (protein, carbohydrates, fats in grams).
- Ensure the meal plan is culturally appropriate and realistic for Indian households.
- Provide general "nutritionalAdvice" relevant to the user's goals and preferences.
- Include a "disclaimer" stating that the advice is AI-generated and not a substitute for professional medical or dietary consultation.

**User Information:**
- Dietary Preferences: {{{dietaryPreferences}}}
- Health Goals: {{{healthGoals}}}
{{#if healthConditions}}- Health Conditions: {{{healthConditions}}}{{/if}}
- Language for response: {{{language}}}

Please generate the 3-day meal plan, nutritional advice, and disclaimer in the specified language.
`,
});

// Flow definition
const generateAIMealPlanFlow = ai.defineFlow(
  {
    name: 'generateAIMealPlanFlow',
    inputSchema: GenerateAIMealPlanInputSchema,
    outputSchema: GenerateAIMealPlanOutputSchema,
  },
  async (input) => {
    const {output} = await generateAIMealPlanPrompt(input);
    if (!output) {
      throw new Error('Failed to generate meal plan output.');
    }
    return output;
  }
);
