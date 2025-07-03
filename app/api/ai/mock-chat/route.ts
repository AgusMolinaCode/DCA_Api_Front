import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Mock chat API called...');
    
    const { messages } = await request.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock response based on user input
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage?.content?.toLowerCase() || '';
    
    let mockResponse = '';
    
    if (userContent.includes('hola') || userContent.includes('hello')) {
      mockResponse = '¡Hola! Soy tu asistente AI para el portfolio de criptomonedas. ¿En qué puedo ayudarte hoy?';
    } else if (userContent.includes('dca')) {
      mockResponse = 'DCA (Dollar Cost Averaging) es una estrategia de inversión donde inviertes una cantidad fija de dinero en intervalos regulares, independientemente del precio del activo. Esto ayuda a reducir el impacto de la volatilidad del mercado.';
    } else if (userContent.includes('portfolio') || userContent.includes('cartera')) {
      mockResponse = 'Para un portfolio equilibrado de criptomonedas, recomiendo diversificar entre diferentes tipos de activos: Bitcoin (30-40%), Ethereum (20-30%), y altcoins prometedoras (30-40%). También es importante no invertir más de lo que puedes permitirte perder.';
    } else if (userContent.includes('bitcoin') || userContent.includes('btc')) {
      mockResponse = 'Bitcoin es la primera y más conocida criptomoneda. Es considerada "oro digital" y actúa como reserva de valor. Muchos inversores la incluyen como base de sus portfolios cripto.';
    } else {
      mockResponse = 'Entiendo tu consulta. Como asistente especializado en criptomonedas, puedo ayudarte con estrategias DCA, análisis de portfolio, diversificación y consejos generales de inversión. ¿Hay algo específico sobre lo que te gustaría saber más?';
    }
    
    console.log('Mock response:', mockResponse);
    
    return new Response(
      JSON.stringify({ 
        message: mockResponse,
        usage: { prompt_tokens: 50, completion_tokens: 100, total_tokens: 150 }
      }), 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in mock chat route:', error);
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