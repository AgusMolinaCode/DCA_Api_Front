import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';
import { getCurrentUserId } from '@/lib/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1'
});

async function getPortfolioData() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/dashboard`, {
      headers: {
        'X-API-Key': userId,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
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
    } else if (portfolioData.dashboard && Array.isArray(portfolioData.dashboard)) {
      const tickers = portfolioData.dashboard.map((item: any) => item.ticker).filter(Boolean);
    } else {
    }
  }

  const result = streamText({
    model: lmstudio('llama-3.2-1b-instruct'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}