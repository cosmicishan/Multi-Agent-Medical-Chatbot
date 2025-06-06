
import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import SearchIndicator from './SearchIndicator';

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
  error?: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  type: string;
  isLoading?: boolean;
  searchInfo?: SearchInfo;
}

interface MessageAreaProps {
  messages: Message[];
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/80 via-white/60 to-emerald-50/40 relative">
      {/* Floating medical icons background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-emerald-600 animate-pulse" />
        <Sparkles className="absolute top-40 right-32 w-6 h-6 text-blue-600 animate-pulse delay-1000" />
        <Sparkles className="absolute bottom-40 left-40 w-7 h-7 text-cyan-600 animate-pulse delay-500" />
      </div>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6`}
        >
          <div
            className={`flex max-w-[85%] ${
              message.isUser ? 'flex-row-reverse' : 'flex-row'
            } items-start space-x-4`}
          >
            {/* Enhanced Avatar */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
                message.isUser
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-300 ml-4'
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-300 mr-4'
              }`}
            >
              {message.isUser ? <User size={22} /> : <Bot size={22} />}
            </div>

            {/* Enhanced Message Content */}
            <div
              className={`rounded-3xl px-6 py-4 max-w-full shadow-lg border backdrop-blur-sm ${
                message.isUser
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-300/50'
                  : 'bg-white/90 border-gray-200/50 text-gray-800'
              }`}
            >
              {/* Search Information */}
              {message.searchInfo && (
                <SearchIndicator searchInfo={message.searchInfo} />
              )}

              {/* Message Content */}
              {message.content && (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              )}

              {/* Enhanced Loading indicator */}
              {message.isLoading && !message.content && (
                <div className="flex items-center space-x-3 text-emerald-600">
                  <div className="relative">
                    <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                    <div className="absolute inset-0 animate-ping w-5 h-5 border border-emerald-300 rounded-full opacity-30"></div>
                  </div>
                  <span className="text-sm font-medium">AI is thinking...</span>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-xs mt-3 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
