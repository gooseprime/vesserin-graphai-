import React, { useState, useMemo } from 'react';
import { Network, Search, Plus, Settings, Filter, Download, Share2, Info } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ObsidianGraph } from './ObsidianGraph';
import { useKnowledgeGraph } from '../../hooks/useKnowledgeGraph';
import { GraphNode } from '../../types';

export function KnowledgeGraph() {
  const { nodes, links, clearGraph, addMessageToGraph, addSampleData, isLoading } = useKnowledgeGraph();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all');
  const [showInfo, setShowInfo] = useState(false);

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedNodeType === 'all' || node.type === selectedNodeType;
      return matchesSearch && matchesType;
    });
  }, [nodes, searchTerm, selectedNodeType]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
  }, [links, filteredNodes]);

  const nodeTypes = useMemo(() => {
    const types = new Set(nodes.map(n => n.type));
    return Array.from(types);
  }, [nodes]);

  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node);
    // Future: Navigate to related message or show node details
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    const data = {
      nodes: filteredNodes,
      links: filteredLinks,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-graph-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Knowledge Graph',
        text: `Check out my knowledge graph with ${nodes.length} nodes and ${links.length} connections!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Knowledge Graph
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visual representation of your conversations and concepts
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Show graph info"
              title="Graph Info"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Share graph"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Export graph"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={clearGraph}
              className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Clear graph"
              title="Clear Graph"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Types</option>
              {nodeTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Graph Stats */}
        {showInfo && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Total Nodes</div>
                <div className="text-gray-500 dark:text-gray-400">{nodes.length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Total Links</div>
                <div className="text-gray-500 dark:text-gray-400">{links.length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Filtered Nodes</div>
                <div className="text-gray-500 dark:text-gray-400">{filteredNodes.length}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Node Types</div>
                <div className="text-gray-500 dark:text-gray-400">{nodeTypes.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {nodes.length === 0 ? (
          <EmptyState
            icon={<Network className="w-16 h-16" />}
            title="Knowledge Graph"
            description="Interactive visualization of concepts and topics from your conversations. Nodes will appear here as you chat."
            action={
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                <p>Start a conversation to see your knowledge network grow</p>
                <div className="mt-2 flex items-center justify-center space-x-4">
                  <button
                    onClick={addSampleData}
                    disabled={isLoading}
                    className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Add Sample Data'}
                  </button>
                </div>
              </div>
            }
          />
        ) : (
          <ObsidianGraph 
            nodes={filteredNodes} 
            links={filteredLinks} 
            onNodeClick={handleNodeClick}
          />
        )}
      </div>
    </div>
  );
}