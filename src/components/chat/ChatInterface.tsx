import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';

export function ChatInterface() {
  const {
    messages,
    selectedModel,
    isLoading,
    error,
    sendMessage,
    regenerateLastMessage,
    setSelectedModel,
    clearChat,
  } = useChat();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <ChatHeader
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onRegenerateMessage={regenerateLastMessage}
        onClearChat={clearChat}
        hasMessages={messages.length > 0}
        isLoading={isLoading}
      />
      
      {error && (
        <div className="mx-4 mt-2 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
        </div>
      )}
      
      <MessageList messages={messages} />
      
      <MessageInput
        onSendMessage={sendMessage}
        disabled={isLoading}
        placeholder="Ask me anything..."
      />
    </div>
  );
}