import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Text chat API called...');
    
    // Verificar que la API key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key de OpenAI no configurada' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { messages } = await request.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));
    
    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })),
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('Generated text:', result.text);
    
    return new Response(
      JSON.stringify({ 
        message: result.text,
        usage: result.usage
      }), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in text chat route:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}