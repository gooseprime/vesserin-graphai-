import { useState, useCallback } from 'react';
import { TabId, NavigationState } from '../types';

export function useNavigation() {
  const [navState, setNavState] = useState<NavigationState>({
    activeTab: 'chat',
    sidebarCollapsed: false,
  });

  const setActiveTab = useCallback((tab: TabId) => {
    setNavState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setNavState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  return {
    ...navState,
    setActiveTab,
    toggleSidebar,
  };
}