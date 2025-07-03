import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Función para obtener el token de autenticación
async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token || null;
}

// Función para obtener datos del portfolio del usuario
async function getPortfolioData() {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.error('No auth token found');
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio data: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

// Función para crear el contexto del portfolio
function createPortfolioContext(portfolioData: any) {
  if (!portfolioData) {
    return "No se pudieron obtener los datos del portfolio en este momento. El usuario puede intentar refrescar o hacer login nuevamente.";
  }

  // Intentar obtener los datos de diferentes estructuras posibles
  let data = null;
  if (portfolioData.data && Array.isArray(portfolioData.data)) {
    data = portfolioData.data;
  } else if (Array.isArray(portfolioData)) {
    data = portfolioData;
  } else if (portfolioData.success && portfolioData.data) {
    data = portfolioData.data;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return "El usuario aún no tiene transacciones de criptomonedas registradas. Puede ayudar al usuario explicando cómo empezar a invertir o cómo usar la plataforma.";
  }

  let context = `Datos del Portfolio del Usuario:\n\n`;

  // Información general
  context += `Total de criptomonedas en portfolio: ${data.length}\n`;
  
  // Calcular totales
  const totalInvested = data.reduce((sum: number, item: any) => sum + (item.total_invested || 0), 0);
  const totalCurrentValue = data.reduce((sum: number, item: any) => sum + ((item.holdings || 0) * (item.current_price || 0)), 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  context += `Total invertido: $${totalInvested.toFixed(2)}\n`;
  context += `Valor actual del portfolio: $${totalCurrentValue.toFixed(2)}\n`;
  context += `Ganancia/Pérdida total: $${totalProfit.toFixed(2)} (${totalProfitPercent.toFixed(2)}%)\n\n`;

  // Detalles por criptomoneda
  context += "Detalles por criptomoneda:\n";
  data.forEach((item: any, index: number) => {
    context += `${index + 1}. ${item.crypto_name || 'N/A'} (${item.ticker || 'N/A'}):\n`;
    context += `   - Holdings: ${(item.holdings || 0).toFixed(8)} ${item.ticker || ''}\n`;
    context += `   - Precio promedio de compra: $${(item.avg_price || 0).toFixed(2)}\n`;
    context += `   - Precio actual: $${(item.current_price || 0).toFixed(2)}\n`;
    context += `   - Total invertido: $${(item.total_invested || 0).toFixed(2)}\n`;
    context += `   - Valor actual: $${((item.holdings || 0) * (item.current_price || 0)).toFixed(2)}\n`;
    context += `   - Profit/Loss: $${(item.current_profit || 0).toFixed(2)} (${(item.profit_percent || 0).toFixed(2)}%)\n\n`;
  });

  return context;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error('NEXT_PUBLIC_OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key de OpenAI no configurada' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { messages } = await request.json();
    console.log('Received messages:', messages?.length || 0);

    // Obtener datos del portfolio
    const portfolioData = await getPortfolioData();
    console.log('Portfolio data loaded:', !!portfolioData);
    const portfolioContext = createPortfolioContext(portfolioData);

    // Sistema de prompts especializado en análisis de crypto
    const systemPrompt = `Eres un asistente experto en análisis de portfolios de criptomonedas. 

Tu misión es ayudar al usuario a tomar decisiones informadas sobre sus inversiones en criptomonedas basándote en los datos de su portfolio actual.

CAPACIDADES:
- Análisis de rendimiento del portfolio
- Sugerencias de diversificación
- Identificación de oportunidades y riesgos
- Explicación de métricas financieras
- Consejos sobre estrategias de inversión (DCA, rebalanceo, etc.)
- Análisis de tendencias de mercado

PRINCIPIOS:
- Siempre basa tus respuestas en los datos reales del portfolio del usuario
- Proporciona análisis objetivos y balanceados
- Explica conceptos complejos de forma simple
- Incluye tanto aspectos positivos como áreas de mejora
- Nunca des consejos financieros definitivos, sino análisis educativo
- Menciona siempre que las inversiones en crypto son de alto riesgo

DATOS DEL PORTFOLIO ACTUAL:
${portfolioContext}

Responde de forma conversacional, profesional y educativa. Si el usuario pregunta sobre algo específico de su portfolio, usa los datos proporcionados.`;

    console.log('Creating AI stream...');
    console.log('System prompt length:', systemPrompt.length);
    console.log('Messages:', JSON.stringify(messages, null, 2));
    
    // Crear instancia personalizada de OpenAI
    const openai = createOpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('Returning stream response...');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in AI chat route:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}