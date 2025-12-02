import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Sparkles, Send, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar: () => void;
  mode: "floating" | "sidebar";
}

const simulatedResponses = [
  "I'd be happy to help with that! Here's what I can suggest...",
  "Great question! Let me break this down for you.",
  "That's interesting! Here are some thoughts on this topic.",
  "I can definitely assist with that. Here's my recommendation.",
];

export const ChatWindow = ({ isOpen, onClose, onToggleSidebar, mode }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { theme, setTheme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
    
    const responseText = `${simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)]}\n\nYou asked: "${userMessage}"\n\nThis is a demo. Connect Lovable Cloud for real AI!`;
    
    setMessages(prev => [
      ...prev,
      { id: generateId(), content: responseText, role: "assistant" }
    ]);
    setIsLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: generateId(),
      content: input.trim(),
      role: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    simulateResponse(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const isFloating = mode === "floating";

  return (
    <div
      className={cn(
        "fixed z-40 bg-card border border-border/60 shadow-2xl flex flex-col overflow-hidden",
        "transition-all duration-300 ease-out",
        isFloating
          ? "bottom-24 right-6 w-[380px] h-[520px] rounded-2xl animate-scale-in origin-bottom-right"
          : "top-0 right-0 h-full w-[420px] rounded-none animate-slide-in-right"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Assistant</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isFloating ? "Open in sidebar" : "Open as floating"}
          >
            {isFloating ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="p-3 rounded-2xl bg-accent/10 mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">How can I help?</h3>
            <p className="text-sm text-muted-foreground">
              Ask me anything or pick a suggestion below.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {["Brainstorm ideas", "Write content", "Explain concepts"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 animate-fade-in",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start animate-fade-in">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="bg-muted px-3 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50 bg-background/50">
        <div className="flex items-end gap-2 bg-muted/50 rounded-xl p-2 border border-border/30 focus-within:border-accent/40 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[24px] max-h-[100px] py-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              input.trim() && !isLoading
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-muted text-muted-foreground/50"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
