import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { openRouterModels } from '../../data/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelData = openRouterModels.find(m => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Select AI model"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <Cpu className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="text-left min-w-0">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {selectedModelData?.name || 'Select Model'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {selectedModelData?.description}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto scrollbar-thin">
          <div className="p-1">
            {openRouterModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 ${
                  selectedModel === model.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
                role="option"
                aria-selected={selectedModel === model.id}
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {model.description}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Context: {model.context_length.toLocaleString()} • Prompt: {model.pricing.prompt}/1K
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}