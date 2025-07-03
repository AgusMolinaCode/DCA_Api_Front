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

export function ChatAICustom() {
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
      console.log('Sending request to API...');
      const response = await fetch('/api/ai/simple-chat', {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          console.log('Processing line:', line);
          
          if (line.startsWith('0:')) {
            try {
              const jsonStr = line.slice(2);
              console.log('Parsing JSON:', jsonStr);
              const data = JSON.parse(jsonStr);
              console.log('Parsed data:', data);
              
              if (typeof data === 'string' && data.length > 0) {
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessage.id 
                      ? { ...m, content: m.content + data }
                      : m
                  )
                );
              }
            } catch (e) {
              console.warn('Failed to parse line:', line, e);
            }
          } else if (line.startsWith('8:')) {
            // Línea de finalización del stream
            console.log('Stream finished');
            break;
          }
        }
      }

      console.log('Stream completed successfully');
    } catch (err) {
      console.error('Request failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // Remove the assistant message if it was added
      setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.content.length > 0));
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
          AI Portfolio Advisor (Custom)
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Versión personalizada del chat AI
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && !error && (
              <div className="text-center text-zinc-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
                <p className="text-lg font-medium mb-2">¡Hola! Soy tu asistente AI</p>
                <p className="text-sm">Prueba preguntas como:</p>
                <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('Hola, ¿cómo estás?')}>
                    "Hola, ¿cómo estás?"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('Explícame qué es DCA')}>
                    "Explícame qué es DCA"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('Dame consejos de inversión')}>
                    "Dame consejos de inversión"
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
            placeholder="Escribe tu mensaje..."
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