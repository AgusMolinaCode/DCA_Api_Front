import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    prompt: `Eres un asistente experto en criptomonedas y estrategias de inversión DCA (Dollar Cost Averaging). 
    Ayudas a usuarios con análisis de portfolio, diversificación y consejos de inversión en criptomonedas.
    
    Responde de manera clara, concisa y útil. Siempre menciona los riesgos asociados con las inversiones en criptomonedas.
    
    Usuario: ${prompt}`,
  });

  return result.toDataStreamResponse();
}