import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';
import { getAuthToken } from '@/lib/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1'
});

async function getPortfolioData() {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log('[DEBUG] No auth token found');
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log('[DEBUG] Response not ok:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('[DEBUG] Dashboard data received:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch portfolio data
  const portfolioData = await getPortfolioData();
  
  let systemPrompt = 'Eres un asistente especializado en criptomonedas. Respondes en español de forma concisa y directa.';
  
  if (portfolioData) {
    systemPrompt += `\n\nPortfolio del usuario:\n${JSON.stringify(portfolioData, null, 2)}\n\nResponde brevemente basándote en estos datos.`;
    
    // Log what tickers are available in the data
    if (Array.isArray(portfolioData)) {
      const tickers = portfolioData.map((item: any) => item.ticker).filter(Boolean);
      console.log('[DEBUG] Available tickers:', tickers);
    } else if (portfolioData.dashboard && Array.isArray(portfolioData.dashboard)) {
      const tickers = portfolioData.dashboard.map((item: any) => item.ticker).filter(Boolean);
      console.log('[DEBUG] Available tickers from dashboard:', tickers);
    } else {
      console.log('[DEBUG] No ticker data found in portfolioData:', Object.keys(portfolioData));
    }
  } else {
    console.log('[DEBUG] No portfolio data available for AI');
  }

  const result = streamText({
    model: lmstudio('llama-3.2-1b-instruct'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}