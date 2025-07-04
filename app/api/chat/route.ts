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
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
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
  }

  const result = streamText({
    model: lmstudio('llama-3.2-1b-instruct'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}