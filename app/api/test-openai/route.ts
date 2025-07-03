import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key exists:', !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.NEXT_PUBLIC_OPENAI_API_KEY?.substring(0, 10));

    // Crear instancia personalizada de OpenAI
    const openai = createOpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const result = streamText({
      model: openai('gpt-4o'),
      messages: [{ role: 'user', content: 'Hola, di solamente "Hola desde OpenAI"' }],
      maxTokens: 50,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Test OpenAI error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyExists: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}