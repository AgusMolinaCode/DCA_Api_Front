import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Direct AI test...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    const { messages } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}`, details: errorText }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Anthropic response:', result);

    return new Response(
      JSON.stringify({ success: true, result }), 
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Direct AI error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Direct API test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}