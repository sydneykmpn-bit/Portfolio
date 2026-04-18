import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export const maxDuration = 30;

// Try models in order — first available wins
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
];

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is missing from .env.local' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = await req.json();
  const groq = createGroq({ apiKey });

  for (const modelId of GROQ_MODELS) {
    try {
      const result = await streamText({
        model: groq(modelId),
        system: SYSTEM_PROMPT,
        messages,
        temperature: 0.75,
        maxTokens: 600,
      });
      console.log(`[chat] using model: ${modelId}`);
      return result.toDataStreamResponse();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[chat] model ${modelId} failed: ${msg}`);
      // If it's an auth error, no point trying other models
      if (msg.includes('401') || msg.includes('invalid_api_key') || msg.includes('Unauthorized')) {
        return new Response(
          JSON.stringify({ error: `Invalid API key — ${msg}` }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Otherwise try next model
    }
  }

  return new Response(
    JSON.stringify({ error: 'All Groq models failed. Check terminal for details.' }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
