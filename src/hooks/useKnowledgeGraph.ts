import { useState, useCallback, useEffect } from 'react';
import { GraphNode, GraphLink, Message } from '../types';

export function useKnowledgeGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced concept extraction with better NLP-like processing
  const extractConceptsFromMessage = useCallback((message: Message): string[] => {
    const content = message.content.toLowerCase();
    
    // Extract key phrases and concepts
    const concepts: string[] = [];
    
    // Extract technical terms (words with capital letters or special patterns)
    const technicalTerms = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    concepts.push(...technicalTerms.slice(0, 2));
    
    // Extract quoted phrases
    const quotedPhrases = content.match(/"([^"]+)"/g) || [];
    concepts.push(...quotedPhrases.map(q => q.replace(/"/g, '')).slice(0, 2));
    
    // Extract sentences that might represent concepts
    const sentences = content
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 15 && sentence.length < 100)
      .slice(0, 2);
    concepts.push(...sentences);
    
    // Create unique concept IDs
    return concepts
      .filter(concept => concept.length > 3)
      .map((concept, index) => `${message.id}-concept-${index}`)
      .slice(0, 3);
  }, []);

  const addMessageToGraph = useCallback((message: Message) => {
    const concepts = extractConceptsFromMessage(message);
    
    const newNodes: GraphNode[] = concepts.map((conceptId, index) => ({
      id: conceptId,
      label: message.content.slice(0, 40) + (message.content.length > 40 ? '...' : ''),
      type: message.role === 'user' ? 'question' : 'answer',
      connections: [],
      timestamp: message.timestamp,
      messageId: message.id,
      metadata: {
        role: message.role,
        content: message.content,
        model: message.model || 'unknown',
      },
    }));

    // Create links between concepts in the same message
    const newLinks: GraphLink[] = [];
    for (let i = 0; i < concepts.length - 1; i++) {
      newLinks.push({
        source: concepts[i],
        target: concepts[i + 1],
        strength: 0.6,
        type: 'sequential',
      });
    }

    setNodes(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const uniqueNewNodes = newNodes.filter(n => !existingIds.has(n.id));
      return [...prev, ...uniqueNewNodes];
    });

    setLinks(prev => [...prev, ...newLinks]);
  }, [extractConceptsFromMessage]);

  const updateNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, []);

  const clearGraph = useCallback(() => {
    setNodes([]);
    setLinks([]);
  }, []);

  const addSampleData = useCallback(() => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const sampleNodes: GraphNode[] = [
        {
          id: 'ai-1',
          label: 'Artificial Intelligence',
          type: 'concept',
          connections: ['ml-1', 'nlp-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'AI concepts', model: 'claude' },
        },
        {
          id: 'ml-1',
          label: 'Machine Learning',
          type: 'concept',
          connections: ['ai-1', 'data-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'ML algorithms', model: 'claude' },
        },
        {
          id: 'nlp-1',
          label: 'Natural Language Processing',
          type: 'topic',
          connections: ['ai-1', 'lang-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'NLP techniques', model: 'claude' },
        },
        {
          id: 'data-1',
          label: 'Data Science',
          type: 'concept',
          connections: ['ml-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'Data analysis', model: 'claude' },
        },
        {
          id: 'lang-1',
          label: 'Language Models',
          type: 'topic',
          connections: ['nlp-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'LLM concepts', model: 'claude' },
        },
        {
          id: 'neural-1',
          label: 'Neural Networks',
          type: 'concept',
          connections: ['ml-1', 'ai-1'],
          timestamp: new Date(),
          metadata: { role: 'assistant', content: 'Deep learning', model: 'claude' },
        },
      ];

      const sampleLinks: GraphLink[] = [
        { source: 'ai-1', target: 'ml-1', strength: 0.8, type: 'related' },
        { source: 'ai-1', target: 'nlp-1', strength: 0.7, type: 'related' },
        { source: 'ml-1', target: 'data-1', strength: 0.6, type: 'related' },
        { source: 'nlp-1', target: 'lang-1', strength: 0.9, type: 'related' },
        { source: 'neural-1', target: 'ml-1', strength: 0.8, type: 'related' },
        { source: 'neural-1', target: 'ai-1', strength: 0.7, type: 'related' },
      ];

      setNodes(sampleNodes);
      setLinks(sampleLinks);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Generate sample data for demonstration
  useEffect(() => {
    addSampleData();
  }, [addSampleData]);

  return {
    nodes,
    links,
    isLoading,
    addMessageToGraph,
    updateNodePosition,
    clearGraph,
    addSampleData,
  };
}