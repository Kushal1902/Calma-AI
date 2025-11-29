import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { genAIService } from '../services/genaiService';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Send, Menu } from 'lucide-react';

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onToggleSidebar }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        role: Role.MODEL,
        text: "Hi there. I'm Calma AI. I'm here to listen, support, and help you find your calm. How are you feeling today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a placeholder for the AI response
      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          role: Role.MODEL,
          text: '',
          timestamp: new Date(),
          isStreaming: true
        },
      ]);

      const stream = genAIService.sendMessageStream(userText);
      let accumulatedText = '';

      for await (const textChunk of stream) {
        accumulatedText += textChunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }

      // Mark streaming as done
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: Role.MODEL,
          text: "I'm having a little trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      // Keep focus on input for better UX
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <button onClick={onToggleSidebar} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800 dark:text-white">Calma AI</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
        <div className="max-w-3xl mx-auto w-full pb-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === Role.USER && (
             <div className="flex justify-start mb-6">
                <TypingIndicator />
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20">
        <div className="max-w-3xl mx-auto relative flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type how you're feeling..."
              className="w-full pl-5 pr-12 py-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">Team Bottom Three © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
