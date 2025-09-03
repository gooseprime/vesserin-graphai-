import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types';
import { useSettings } from './useSettings';

export function useChat() {
  const { settings } = useSettings();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    selectedModel: 'anthropic/claude-3.5-sonnet',
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    if (!settings.openRouterApiKey) {
      setChatState(prev => ({
        ...prev,
        error: 'Please configure your OpenRouter API key in Settings',
      }));
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Vesserin Chat',
        },
        body: JSON.stringify({
          model: chatState.selectedModel,
          messages: [
            ...chatState.messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: content.trim() }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || 'No response received';
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      setChatState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        isLoading: false,
      }));
    }
  }, [chatState.selectedModel, chatState.messages, settings.openRouterApiKey]);

  const regenerateLastMessage = useCallback(async () => {
    const lastUserMessage = [...chatState.messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last AI response if it exists
    const messagesWithoutLastAI = chatState.messages.filter((_, index) => {
      if (index === chatState.messages.length - 1) {
        return chatState.messages[index].role !== 'assistant';
      }
      return true;
    });

    setChatState(prev => ({
      ...prev,
      messages: messagesWithoutLastAI,
    }));

    await sendMessage(lastUserMessage.content);
  }, [chatState.messages, sendMessage]);

  const setSelectedModel = useCallback((model: string) => {
    setChatState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  const clearChat = useCallback(() => {
    setChatState(prev => ({ ...prev, messages: [], error: null }));
  }, []);

  return {
    ...chatState,
    sendMessage,
    regenerateLastMessage,
    setSelectedModel,
    clearChat,
  };
}