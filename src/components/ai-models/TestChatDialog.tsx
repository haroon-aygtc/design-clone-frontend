
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIModel } from "@/types/aiModels";
import { Bot, Send, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: AIModel;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TestChatDialog = ({ open, onOpenChange, model }: TestChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial welcome message when dialog opens
  useEffect(() => {
    if (open) {
      const initialMessage = `Hello! I'm a test interface for ${model.name}. How can I help you today?`;
      setMessages([{
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date()
      }]);
    } else {
      // Clear messages when dialog closes
      setMessages([]);
    }
  }, [open, model.name]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // This is a mock response - in a real app, you'd call the AI API
      const responseContent = simulateResponse(input);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Simple mock response function - in a real app, this would be an API call
  const simulateResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('hello') || userInputLower.includes('hi')) {
      return `Hello! I'm a test instance of ${model.name}. This is a simulated response to help you test the model integration.`;
    }
    
    if (userInputLower.includes('help')) {
      return `I'm here to help! This is a test chat interface for ${model.name}. In a real implementation, your messages would be sent to the ${model.provider} API using your configured settings.`;
    }
    
    if (userInputLower.includes('settings') || userInputLower.includes('configuration')) {
      return `This ${model.name} model is configured with temperature: ${model.configuration?.temperature || 0.7} and max tokens: ${model.configuration?.maxTokens || 2000}.`;
    }
    
    return `This is a simulated response from ${model.name} (${model.provider}). In a production environment, your message would be processed by the actual AI model with your configured settings.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle>{model.name} - Test Chat</DialogTitle>
            </div>
            <Badge variant="outline">{model.provider}</Badge>
          </div>
          <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
            <div>Temperature: {model.configuration?.temperature || 0.7}</div>
            <div>•</div>
            <div>Max Tokens: {model.configuration?.maxTokens || 2000}</div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'assistant' 
                      ? <Bot className="h-4 w-4" /> 
                      : <User className="h-4 w-4" />
                    }
                    <span className="text-xs font-medium">
                      {message.role === 'assistant' ? model.name : 'You'}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium">{model.name}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex w-full items-center gap-2">
            <Input 
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full text-xs text-muted-foreground text-center mt-2">
            This is a test interface. Messages aren't actually sent to the AI provider.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestChatDialog;
