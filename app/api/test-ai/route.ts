import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST() {
  try {
    console.log('Testing Anthropic API...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      messages: [{ role: 'user', content: 'Hola, di solamente "Hola desde Anthropic"' }],
      maxTokens: 50,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Test AI error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyExists: !!process.env.ANTHROPIC_API_KEY
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}