import React, { useMemo } from 'react';
import { Message, Role } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  // Simple function to detect URLs and wrap them in anchor tags
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-300 underline hover:text-indigo-800 dark:hover:text-indigo-100 transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(message.timestamp);
  }, [message.timestamp]);

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-teal-500 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'
            }`}
          >
            {renderTextWithLinks(message.text)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {formattedTime}
          </span>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
