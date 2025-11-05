import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// GoogleAI plugin will automatically use GOOGLE_GENAI_API_KEY from environment variables
// If not set, googleAI() will try to use the default credentials or fail gracefully
export const ai = genkit({
  plugins: [
    // googleAI() without arguments will use GOOGLE_GENAI_API_KEY from env vars
    // or default application credentials
    googleAI(),
  ],
  model: 'googleai/gemini-2.5-flash',
});
