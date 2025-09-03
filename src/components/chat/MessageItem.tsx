import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../../types';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <div className={`chat-message flex space-x-3 p-4 ${isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          : 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
          {message.isLoading ? (
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <div className="loading-dots">●</div>
              <div className="loading-dots" style={{ animationDelay: '0.2s' }}>●</div>
              <div className="loading-dots" style={{ animationDelay: '0.4s' }}>●</div>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}