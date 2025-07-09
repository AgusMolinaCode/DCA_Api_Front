import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getCurrentUserId, getCurrentBalance, getTransactions } from '@/lib/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepseek = createOpenAI({
  name: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
});

async function getPortfolioData() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    // Fetch current balance and transactions in parallel
    const [balanceResult, transactionsResult] = await Promise.all([
      getCurrentBalance(),
      getTransactions()
    ]);

    const portfolioData = {
      balance: balanceResult.success ? balanceResult.data : null,
      transactions: transactionsResult.success ? transactionsResult.data : [],
      hasData: balanceResult.success || transactionsResult.success
    };

    return portfolioData;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch portfolio data
  const portfolioData = await getPortfolioData();
  
  let systemPrompt = 'Eres un asistente especializado en criptomonedas y gestión de portafolios. Respondes en español de forma concisa y directa.';
  
  if (portfolioData && portfolioData.hasData) {
    systemPrompt += `\n\nDatos del portfolio del usuario:\n`;
    
    // Add balance information
    if (portfolioData.balance) {
      systemPrompt += `Balance actual: ${JSON.stringify(portfolioData.balance, null, 2)}\n`;
    }
    
    // Add transactions information
    if (portfolioData.transactions && portfolioData.transactions.length > 0) {
      systemPrompt += `Transacciones: ${JSON.stringify(portfolioData.transactions, null, 2)}\n`;
      
      // Extract tickers from transactions
      const tickers = portfolioData.transactions
        .map((item: any) => item.ticker)
        .filter(Boolean)
        .filter((ticker: string, index: number, array: string[]) => array.indexOf(ticker) === index); // Remove duplicates
        
      if (tickers.length > 0) {
        systemPrompt += `Criptomonedas en el portfolio: ${tickers.join(', ')}\n`;
      }
    }
    
    systemPrompt += `\nUsa esta información para responder preguntas sobre el portfolio, rendimiento, holdings, ganancias/pérdidas, y dar recomendaciones de inversión personalizadas.`;
  } else {
    systemPrompt += `\n\nEl usuario no tiene datos de portfolio disponibles. Puedes dar consejos generales sobre criptomonedas e inversión.`;
  }

  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}