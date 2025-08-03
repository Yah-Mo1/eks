/**
 * Environment Configuration
 *
 * This file centralises environment variable handling for the Resume Analyser application.
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a `.env` file in the root directory of your project
 * 2. Add the following line to your `.env` file:
 *    VITE_OPENAI_API_KEY=your_actual_api_key_here
 *
 * 3. Get your OpenAI API key:
 *    - Go to https://platform.openai.com/api-keys
 *    - Create a new API key
 *    - Copy the key and replace 'your_actual_api_key_here' with it
 *
 * 4. Restart your development server after adding the environment variable
 *
 * IMPORTANT SECURITY NOTES:
 * - Never commit your actual API key to version control
 * - In production, API calls should be made from a backend server
 * - The current implementation uses client-side calls for demo purposes
 * - Consider implementing rate limiting and usage monitoring
 *
 * EXAMPLE .env FILE:
 *
 * # OpenAI Configuration
 * VITE_OPENAI_API_KEY=sk-proj-abcd1234...your-actual-key-here
 *
 */

export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    isConfigured: Boolean(
      import.meta.env.VITE_OPENAI_API_KEY &&
        import.meta.env.VITE_OPENAI_API_KEY !== "your_openai_api_key_here"
    ),
  },
} as const;

export const getOpenAIKey = (): string => {
  const key = config.openai.apiKey;

  if (!key || key === "your_openai_api_key_here") {
    throw new Error(
      "OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables. " +
        "See src/config/environment.ts for setup instructions."
    );
  }

  return key;
};

export const isOpenAIConfigured = (): boolean => config.openai.isConfigured;
