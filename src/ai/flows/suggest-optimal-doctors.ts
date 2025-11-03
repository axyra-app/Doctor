'use server';

/**
 * @fileOverview A flow that suggests a ranked list of optimal doctors based on various factors.
 *
 * - suggestOptimalDoctors - A function that handles the doctor suggestion process.
 * - SuggestOptimalDoctorsInput - The input type for the suggestOptimalDoctors function.
 * - SuggestOptimalDoctorsOutput - The return type for the suggestOptimalDoctors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalDoctorsInputSchema = z.object({
  medicalSpecialty: z.string().describe('The required medical specialty.'),
  location: z.string().describe('The patient location.'),
  patientReviews: z.string().describe('Patient reviews of nearby doctors.'),
  doctorAvailability: z.string().describe('Doctor availability information.'),
  pricing: z.string().describe('Pricing information.'),
  insuranceCoverage: z.string().describe('Insurance coverage details.'),
});
export type SuggestOptimalDoctorsInput = z.infer<typeof SuggestOptimalDoctorsInputSchema>;

const SuggestOptimalDoctorsOutputSchema = z.object({
  rankedDoctorList: z
    .string()
    .describe('A ranked list of doctors based on the input factors.'),
});
export type SuggestOptimalDoctorsOutput = z.infer<typeof SuggestOptimalDoctorsOutputSchema>;

export async function suggestOptimalDoctors(
  input: SuggestOptimalDoctorsInput
): Promise<SuggestOptimalDoctorsOutput> {
  return suggestOptimalDoctorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalDoctorsPrompt',
  input: {schema: SuggestOptimalDoctorsInputSchema},
  output: {schema: SuggestOptimalDoctorsOutputSchema},
  prompt: `You are a medical assistant that suggests a ranked list of doctors based on the following information:

Medical Specialty: {{{medicalSpecialty}}}
Location: {{{location}}}
Patient Reviews: {{{patientReviews}}}
Doctor Availability: {{{doctorAvailability}}}
Pricing: {{{pricing}}}
Insurance Coverage: {{{insuranceCoverage}}}

Considering all factors, return a ranked list of doctors.`,
});

const suggestOptimalDoctorsFlow = ai.defineFlow(
  {
    name: 'suggestOptimalDoctorsFlow',
    inputSchema: SuggestOptimalDoctorsInputSchema,
    outputSchema: SuggestOptimalDoctorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
