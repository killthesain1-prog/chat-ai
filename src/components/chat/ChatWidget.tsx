import { useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatWindow } from "./ChatWindow";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"floating" | "sidebar">("floating");

  const toggleChat = () => setIsOpen(!isOpen);
  
  const toggleMode = () => {
    setMode(mode === "floating" ? "sidebar" : "floating");
  };

  return (
    <>
      {/* Overlay for sidebar mode */}
      {isOpen && mode === "sidebar" && (
        <div 
          className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-30 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <ChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onToggleSidebar={toggleMode}
        mode={mode}
      />
      
      <ChatBubble 
        isOpen={isOpen} 
        onClick={toggleChat} 
      />
    </>
  );
};
