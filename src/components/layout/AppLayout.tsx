import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { SidebarNav } from '../navigation/SidebarNav';
import { BottomTabNav } from '../navigation/BottomTabNav';
import { ChatInterface } from '../chat/ChatInterface';
import { KnowledgeGraph } from '../knowledge/KnowledgeGraph';
import { SettingsInterface } from '../settings/SettingsInterface';

export function AppLayout() {
  const { activeTab, sidebarCollapsed, setActiveTab, toggleSidebar } = useNavigation();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'knowledge-graph':
        return <KnowledgeGraph />;
      case 'settings':
        return <SettingsInterface />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div
          id={`${activeTab}-panel`}
          className="flex-1 flex flex-col"
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab`}
        >
          {renderTabContent()}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>
    </div>
  );
}