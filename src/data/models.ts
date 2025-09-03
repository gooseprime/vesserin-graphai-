import { OpenRouterModel } from '../types';

export const openRouterModels: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Most capable model, excellent for reasoning and analysis',
    context_length: 200000,
    pricing: {
      prompt: '$0.003',
      completion: '$0.015',
    },
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient for most tasks',
    context_length: 200000,
    pricing: {
      prompt: '$0.00025',
      completion: '$0.00125',
    },
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Premium model for complex creative and analytical tasks',
    context_length: 200000,
    pricing: {
      prompt: '$0.015',
      completion: '$0.075',
    },
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest multimodal model',
    context_length: 128000,
    pricing: {
      prompt: '$0.005',
      completion: '$0.015',
    },
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    description: 'Open source model, excellent value',
    context_length: 131072,
    pricing: {
      prompt: '$0.00088',
      completion: '$0.00088',
    },
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Google\'s advanced reasoning model',
    context_length: 2000000,
    pricing: {
      prompt: '$0.00125',
      completion: '$0.005',
    },
  },
];