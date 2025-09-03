import React from 'react';
import { MessageCircle, Network, Settings, Menu, X } from 'lucide-react';
import { TabId } from '../../types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const tabs = [
  {
    id: 'chat' as TabId,
    label: 'Chat',
    icon: MessageCircle,
    description: 'AI Conversations',
  },
  {
    id: 'knowledge-graph' as TabId,
    label: 'Knowledge Graph',
    icon: Network,
    description: 'Visual Knowledge Map',
  },
  {
    id: 'settings' as TabId,
    label: 'Settings',
    icon: Settings,
    description: 'App Configuration',
  },
];

export function SidebarNav({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarNavProps) {
  return (
    <aside 
      className={`hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Vesserin
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI Chat Platform
              </p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="touch-target rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 mb-1 ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              title={collapsed ? tab.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">{tab.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {tab.description}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Made with ⚡ by Vesserin
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}