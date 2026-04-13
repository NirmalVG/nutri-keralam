'use server';
/**
 * @fileOverview A Genkit flow for extracting key health markers from uploaded PDF lab reports.
 *
 * - extractLabReportMarkers - A function that handles the extraction process.
 * - ExtractLabReportMarkersInput - The input type for the extractLabReportMarkers function.
 * - ExtractLabReportMarkersOutput - The return type for the extractLabReportMarkers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLabReportMarkersInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The content type should be 'application/pdf'."
    ),
});
export type ExtractLabReportMarkersInput = z.infer<typeof ExtractLabReportMarkersInputSchema>;

const ExtractedMarkerSchema = z.object({
  name: z.string().describe('The name of the health marker (e.g., Hemoglobin, Total Cholesterol).'),
  value: z.string().describe('The measured value of the marker. Can be a number, range, or text (e.g., "14.5", "<200", "Positive").'),
  unit: z.string().optional().describe('The unit of measurement for the marker (e.g., "g/dL", "mg/dL").'),
  referenceRange: z.string().optional().describe('The normal or reference range for the marker.'),
  interpretation: z.string().optional().describe('A brief interpretation of the marker value relative to the reference range (e.g., "Normal", "High", "Low").'),
});

const ExtractLabReportMarkersOutputSchema = z.object({
  reportType: z.string().describe('The identified type of the lab report (e.g., "Thyrocare", "Dr. Lal PathLabs", or "Generic/Unknown").'),
  patientName: z.string().optional().describe('The name of the patient as found in the report.'),
  reportDate: z.string().optional().describe('The date the report was issued, in YYYY-MM-DD format if possible.'),
  extractedMarkers: z.array(ExtractedMarkerSchema).describe('An array of key health markers extracted from the report.'),
  summary: z.string().optional().describe('A brief summary of the overall report, highlighting any significant findings.'),
});
export type ExtractLabReportMarkersOutput = z.infer<typeof ExtractLabReportMarkersOutputSchema>;

export async function extractLabReportMarkers(input: ExtractLabReportMarkersInput): Promise<ExtractLabReportMarkersOutput> {
  return extractLabReportMarkersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractLabReportMarkersPrompt',
  input: {schema: ExtractLabReportMarkersInputSchema},
  output: {schema: ExtractLabReportMarkersOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing medical lab reports.\nYour task is to parse the provided PDF lab report and extract key health markers and other relevant information.\nIdentify the lab report type, patient name, report date, and a list of specific health markers with their values, units, reference ranges, and an interpretation.\nIf a piece of information is not present or cannot be reliably extracted, omit it or mark it as 'N/A' as appropriate.\nBe precise and thorough in your extraction.\n\nLab Report PDF: {{media url=pdfDataUri}}`,
});

const extractLabReportMarkersFlow = ai.defineFlow(
  {
    name: 'extractLabReportMarkersFlow',
    inputSchema: ExtractLabReportMarkersInputSchema,
    outputSchema: ExtractLabReportMarkersOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
