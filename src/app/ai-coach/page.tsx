'use client';

import { useState, useRef, useEffect } from 'react';
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Loader2, Sparkles, User, Bot } from "lucide-react";
import Link from "next/link";
import { aiCoachChat } from "@/ai/flows/ai-coach-chat";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Namaskaram! I'm your AI Coach. How can I help you with your nutrition today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await aiCoachChat({
        history: messages,
        message: userMessage,
        language: 'English' // Could be dynamic
      });

      setMessages([...newMessages, { role: 'model', content: result.response }]);
    } catch (error) {
      toast({
        title: "Coach is offline",
        description: "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
      // Optionally remove the user message if it failed or keep it?
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24 md:pb-0 md:pl-64">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <Link href="/dashboard" className="md:hidden">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-headline font-bold leading-none">AI Health Coach</h1>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
              Online & Ready
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8 shrink-0">
                  {msg.role === 'model' ? (
                    <>
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback className="bg-primary text-white"><Bot size={16} /></AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback className="bg-muted text-muted-foreground"><User size={16} /></AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white text-foreground rounded-tl-none border border-border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white"><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="bg-white border p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={16} />
                  <span className="text-xs text-muted-foreground italic">Coach is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Bar */}
        <Card className="mt-4 border-none shadow-xl bg-white overflow-hidden rounded-[2rem]">
          <CardContent className="p-2 flex gap-2 items-center">
            <Input 
              placeholder="Ask about Indian diet, recipes, or health..." 
              className="border-none bg-transparent focus-visible:ring-0 text-base h-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              size="icon" 
              className="w-12 h-12 rounded-full shrink-0" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send size={20} />
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
