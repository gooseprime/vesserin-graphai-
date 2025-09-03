export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  model?: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export interface ChatState {
  messages: Message[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export type TabId = 'chat' | 'knowledge-graph';

export type TabId = 'chat' | 'knowledge-graph' | 'settings';

export interface NavigationState {
  activeTab: TabId;
  sidebarCollapsed: boolean;
}

export interface Settings {
  openRouterApiKey: string;
  defaultModel: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'md' | 'lg';
  autoSave: boolean;
  showTimestamps: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'topic' | 'question' | 'answer';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  connections: string[];
  timestamp: Date;
  messageId?: string;
  metadata?: {
    role: string;
    content: string;
    model: string;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
  type?: 'related' | 'sequential' | 'hierarchical';
}