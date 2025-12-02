import { ChatWidget } from "@/components/chat/ChatWidget";
import { Sparkles, Zap, Shield, Globe, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Get intelligent responses powered by advanced language models."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant responses with real-time streaming capabilities."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations are encrypted and never stored."
  },
  {
    icon: Globe,
    title: "Always Available",
    description: "24/7 assistance whenever you need help."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10" />
        
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent/10">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold text-foreground">ChatBot</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <Link to="/pdf-chat" className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PDF Chat
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI Assistant
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Your intelligent
            <span className="block text-accent">AI companion</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Experience seamless conversations with our AI chatbot. Available as a floating widget or sidebar — you choose how to chat.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link to="/pdf-chat" className="px-6 py-3 text-sm font-medium bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Try PDF Chat →
            </Link>
            <button className="px-6 py-3 text-sm font-medium bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why choose our chatbot?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with the latest AI technology to provide you with the best conversational experience.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-accent/10 w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Two ways to chat
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Click the chat bubble in the bottom right corner. Use the expand button to switch between floating and sidebar modes.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Floating Mode</h3>
              <p className="text-sm text-muted-foreground">
                A compact popup that stays in the corner of your screen. Perfect for quick questions.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sidebar Mode</h3>
              <p className="text-sm text-muted-foreground">
                A full-height panel that slides in from the right. Ideal for longer conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">ChatBot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Powered by Lovable
          </p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;
