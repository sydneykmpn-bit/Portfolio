import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ reply: 'API key not configured.' }, { status: 500 });
    }

    const groq = createGroq({ apiKey });
    // Only use active models — llama-3.1-70b and llama3-70b-8192 are decommissioned
    const models = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'gemma2-9b-it',
    ];

    for (const model of models) {
      try {
        const { text } = await generateText({
          model: groq(model),
          system: SYSTEM_PROMPT,
          messages,
          temperature: 0.7,
          maxTokens: 350,
        });
        return Response.json({ reply: text });
      } catch {
        continue;
      }
    }

    return Response.json({ reply: 'Something went wrong — email sydneykmpn@gmail.com directly!' }, { status: 500 });
  } catch (err) {
    console.error('[chat-widget]', err);
    return Response.json({ reply: 'Connection error. Try emailing sydneykmpn@gmail.com.' }, { status: 500 });
  }
}
