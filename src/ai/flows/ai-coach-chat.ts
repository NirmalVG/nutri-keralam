'use server';
/**
 * @fileOverview A Genkit flow for the AI NutriCoach specialized in Indian nutrition.
 *
 * - aiCoachChat - A function that handles the chat conversation.
 * - AICoachChatInput - The input type for the aiCoachChat function.
 * - AICoachChatOutput - The return type for the aiCoachChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const AICoachChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The new user message.'),
  language: z.string().default('English').describe('The preferred language for response.'),
});
export type AICoachChatInput = z.infer<typeof AICoachChatInputSchema>;

const AICoachChatOutputSchema = z.object({
  response: z.string().describe('The AI coach response.'),
});
export type AICoachChatOutput = z.infer<typeof AICoachChatOutputSchema>;

export async function aiCoachChat(input: AICoachChatInput): Promise<AICoachChatOutput> {
  return aiCoachChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCoachChatPrompt',
  input: {schema: AICoachChatInputSchema},
  output: {schema: AICoachChatOutputSchema},
  prompt: `You are NutriKeralam's AI Coach, an expert in Indian clinical nutrition and traditional dietary wisdom.
Your goal is to provide supportive, evidence-based nutritional advice within the context of Indian cuisine (Keralite, South Indian, North Indian, etc.).

**Guidelines:**
1. Be encouraging and empathetic.
2. Use Indian cultural references where appropriate (e.g., Muringa for iron, turmeric for inflammation).
3. If the user asks about medical conditions, provide helpful nutritional context but remind them to consult a doctor.
4. Respect the user's preferred language: {{{language}}}.
5. Keep responses concise and actionable.

**Conversation History:**
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User: {{{message}}}
AI Coach:`,
});

const aiCoachChatFlow = ai.defineFlow(
  {
    name: 'aiCoachChatFlow',
    inputSchema: AICoachChatInputSchema,
    outputSchema: AICoachChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
