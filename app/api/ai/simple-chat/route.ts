import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple chat API called...');
    
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
    
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 200,
    });

    console.log('Returning simple stream response...');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in simple chat route:', error);
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