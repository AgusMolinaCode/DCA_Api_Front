"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { Loader, MessageCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatAI() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({});
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current && (status === "streaming" || status === "submitted")) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, status]);

  const ChatContent = React.useMemo(() => {
    return (
    <div className="flex flex-col h-[400px] lg:h-[600px]">
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
        <div className="space-y-4 p-2">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1">
              <div className="flex-1">
                <span className="font-semibold">
                  {message.role === "user" ? "User: " : "AI: "}
                </span>
                <span className="whitespace-pre-wrap">{message.content}</span>
              </div>
            </div>
          ))}

          {(status === "submitted" || status === "streaming") && (
            <div className="flex items-center gap-2">
              {status === "submitted" && <Loader className="animate-spin h-4 w-4" />}
              <button 
                type="button" 
                onClick={() => stop()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={status !== "ready"}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          disabled={status !== "ready"}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
    );
  }, [messages, input, status, handleInputChange, handleSubmit, stop]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4">
            <MessageCircle />
          </button>
        </DialogTrigger>
        <DialogContent className="lg:max-w-4xl lg:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chat AI</DialogTitle>
          </DialogHeader>
          {ChatContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="fixed bottom-4 right-4">
          <MessageCircle />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chat AI</DrawerTitle>
        </DrawerHeader>
        {ChatContent}
      </DrawerContent>
    </Drawer>
  );
}
