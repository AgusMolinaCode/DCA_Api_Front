"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatAISimple() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending request to text API...');
      const response = await fetch('/api/ai/mock-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err) {
      console.error('Request failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card className="bg-zinc-800 border-zinc-600 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-500" />
          AI Portfolio Advisor (Demo)
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Modo demo - Resuelve el problema de cuota de OpenAI para funcionalidad completa
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && !error && (
              <div className="text-center text-zinc-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
                <p className="text-lg font-medium mb-2">¡Hola! Soy tu asistente de portfolio</p>
                <p className="text-sm">Puedes preguntarme sobre:</p>
                <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('¿Qué es DCA y cómo funciona?')}>
                    "¿Qué es DCA y cómo funciona?"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('Dame consejos para diversificar mi portfolio')}>
                    "Dame consejos para diversificar mi portfolio"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('¿Cuándo es buen momento para comprar criptomonedas?')}>
                    "¿Cuándo es buen momento para comprar criptomonedas?"
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-emerald-600'
                        : 'bg-zinc-700'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-700 text-zinc-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="bg-zinc-700 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Generando respuesta...</span>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-red-400" />
                </div>
                <div className="bg-red-700 rounded-lg px-4 py-3">
                  <div className="text-red-100 text-sm">
                    Error: {error}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre inversiones, DCA, portfolio..."
            className="flex-1 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}