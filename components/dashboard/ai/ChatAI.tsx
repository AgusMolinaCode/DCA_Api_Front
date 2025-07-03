"use client";

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export function ChatAI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    api: '/api/ai/chat',
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('Chat finished:', message);
    },
  });

  // Debug logs
  console.log('ChatAI rendered - messages:', messages.length, 'isLoading:', isLoading, 'error:', error);

  const handleSuggestedQuestion = (question: string) => {
    append({ role: 'user', content: question });
  };

  return (
    <Card className="bg-zinc-800 border-zinc-600 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-500" />
          AI Portfolio Advisor
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Pregúntame sobre tu portfolio, estrategias de inversión y análisis de mercado
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Área de mensajes */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && !error && (
              <div className="text-center text-zinc-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
                <p className="text-lg font-medium mb-2">¡Hola! Soy tu asistente de portfolio</p>
                <p className="text-sm">
                  Puedes preguntarme cosas como:
                </p>
                <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('¿Cómo está mi portfolio hoy?')}>
                    "¿Cómo está mi portfolio hoy?"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('¿Debería diversificar más mis inversiones?')}>
                    "¿Debería diversificar más mis inversiones?"
                  </p>
                  <p className="text-xs bg-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-600 transition-colors"
                     onClick={() => handleSuggestedQuestion('¿Cuáles son mis mejores y peores inversiones?')}>
                    "¿Cuáles son mis mejores y peores inversiones?"
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
                    <span className="text-sm">Analizando tu portfolio...</span>
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
                    Error: {error.message || 'Algo salió mal. Intenta de nuevo.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input del chat */}
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Pregúntame sobre tu portfolio..."
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