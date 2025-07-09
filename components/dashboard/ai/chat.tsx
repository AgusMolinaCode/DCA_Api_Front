"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { Loader } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatAI() {
  const [open, setOpen] = React.useState(false);
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({});
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "¿Cuál es mi balance actual?",
    "¿Qué criptomonedas tengo en mi portfolio?",
    "¿Cuál es mi mejor inversión?",
    "¿Cómo está mi diversificación?",
    "¿Debería vender alguna posición?"
  ];

  const handleQuestionClick = (question: string) => {
    // Simulate typing the question
    const syntheticEvent = {
      target: { value: question },
      currentTarget: { value: question }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, status]);

  React.useEffect(() => {
    if (status === "streaming" && scrollAreaRef.current) {
      const scrollToBottom = () => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      };
      
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  const ChatContent = React.useMemo(() => {
    return (
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-100">
        <div 
          ref={scrollAreaRef} 
          className="flex-1 overflow-y-auto pr-4 pb-4"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <div className="space-y-4 p-2 bg-zinc-900">
            {messages.length === 0 && (
              <div className="text-center text-zinc-400 py-8">
                <div className="mb-6">
                  ¡Hola! Soy tu asistente de criptomonedas. Pregúntame sobre tu portfolio o inversiones.
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500 mb-4">Preguntas sugeridas:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="block w-full text-left p-3 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-zinc-300 hover:text-zinc-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                <div className="flex-1">
                  <span className="font-semibold text-zinc-300">
                    {message.role === "user" ? "User: " : "AI: "}
                  </span>
                  <span className="whitespace-pre-wrap text-zinc-100">{message.content}</span>
                </div>
              </div>
            ))}

            {(status === "submitted" || status === "streaming") && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                {status === "submitted" && (
                  <Loader className="animate-spin h-4 w-4 text-zinc-400" />
                )}
                <button
                  type="button"
                  onClick={() => stop()}
                  className="bg-red-500/40 hover:bg-red-600/40 text-white px-3 py-1 rounded"
                >
                  Detener
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-zinc-800 border-t border-zinc-700 sticky bottom-0 mt-auto">
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            disabled={status !== "ready"}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 placeholder-zinc-400"
          />
          <button
            type="submit"
            disabled={status !== "ready"}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 disabled:text-zinc-400 text-white px-4 py-2 rounded-md"
          >
            Enviar
          </button>
        </form>
      </div>
    );
  }, [messages, input, status, handleInputChange, handleSubmit, stop]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Chat AI
        </button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-900 border-zinc-700 w-full sm:max-w-2xl flex flex-col">
        <SheetHeader className="bg-zinc-900 border-b border-zinc-700 pb-4">
          <SheetTitle className="text-zinc-100">Chat AI</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col mt-4">
          {ChatContent}
        </div>
      </SheetContent>
    </Sheet>
  );
}
