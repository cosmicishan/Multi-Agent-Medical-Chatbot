
import React from 'react';
import { Send, Mic, Sparkles } from 'lucide-react';

interface InputBarProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InputBar: React.FC<InputBarProps> = ({ currentMessage, setCurrentMessage, onSubmit }) => {
  return (
    <div className="border-t border-gradient-to-r from-emerald-200/50 via-cyan-200/50 to-blue-200/50 bg-white/95 backdrop-blur-sm p-6 relative">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 opacity-50"></div>
      
      <form onSubmit={onSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Describe your symptoms or ask a medical question..."
            className="w-full resize-none border-2 border-gray-200/60 rounded-3xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-300 text-gray-700 placeholder-gray-400 min-h-[60px] max-h-36 bg-white/80 backdrop-blur-sm shadow-sm"
            rows={1}
            style={{ lineHeight: '1.5' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors duration-300 p-2 rounded-full hover:bg-emerald-50"
          >
            <Mic size={20} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!currentMessage.trim()}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-3xl hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <Send size={22} className="relative z-10" />
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-500 text-center flex items-center justify-center space-x-2">
        <Sparkles size={14} className="text-emerald-500" />
        <span>💡 Be specific about your symptoms for more accurate guidance. Press Shift+Enter for new line.</span>
        <Sparkles size={14} className="text-emerald-500" />
      </div>
    </div>
  );
};

export default InputBar;
