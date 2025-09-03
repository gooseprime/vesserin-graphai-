import React from 'react';
import { RotateCcw, Trash2, Settings } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useSettings } from '../../hooks/useSettings';

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onRegenerateMessage: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
  isLoading: boolean;
}

export function ChatHeader({ 
  selectedModel, 
  onModelChange, 
  onRegenerateMessage,
  onClearChat,
  hasMessages,
  isLoading 
}: ChatHeaderProps) {
  const { openSettings, isApiKeyConfigured } = useSettings();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {!isApiKeyConfigured && (
        <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
          <p className="text-sm text-warning-700 dark:text-warning-400">
            Please configure your OpenRouter API key in{' '}
            <button 
              onClick={openSettings}
              className="font-medium underline hover:no-underline"
            >
              Settings
            </button>
            {' '}to start chatting.
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            AI Chat
          </h1>
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          {hasMessages && (
            <>
              <button
                onClick={onRegenerateMessage}
                disabled={isLoading || !isApiKeyConfigured}
                className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Regenerate last response"
                title="Regenerate last response"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClearChat}
                disabled={isLoading || !isApiKeyConfigured}
                className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={openSettings}
            className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}