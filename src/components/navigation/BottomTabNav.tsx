import React from 'react';
import { MessageCircle, Network, Settings } from 'lucide-react';
import { TabId } from '../../types';

interface BottomTabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  {
    id: 'chat' as TabId,
    label: 'Chat',
    icon: MessageCircle,
  },
  {
    id: 'knowledge-graph' as TabId,
    label: 'Knowledge',
    icon: Network,
  },
  {
    id: 'settings' as TabId,
    label: 'Settings',
    icon: Settings,
  },
];

export function BottomTabNav({ activeTab, onTabChange }: BottomTabNavProps) {
  return (
    <nav 
      className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}