'use client';

import { useCompletion } from '@ai-sdk/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export function ChatAICompletion() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error } = useCompletion({
    api: '/api/ai/completion',
  });

  const handleSuggestedQuestion = (question: string) => {
    // For useCompletion, we need to manually trigger the input change
    const syntheticEvent = {
      target: { value: question }
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
  };

  return (
    <Card className="bg-zinc-800 border-zinc-600 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-500" />
          AI Portfolio Advisor
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Asistente inteligente para tu portfolio de criptomonedas
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {!completion && !isLoading && !error && (
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
            
            {/* Show user input if there's completion or loading */}
            {(completion || isLoading) && input && (
              <div className="flex gap-3 justify-end">
                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-emerald-600 text-white">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {input}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show completion response */}
            {completion && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%] flex-row">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-zinc-700 text-zinc-100">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {completion}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show loading state */}
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
            
            {/* Show error state */}
            {error && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-red-400" />
                </div>
                <div className="bg-red-700 rounded-lg px-4 py-3">
                  <div className="text-red-100 text-sm">
                    Error: {error.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            name="prompt"
            value={input}
            onChange={handleInputChange}
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