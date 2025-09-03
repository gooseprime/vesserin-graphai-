import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useTheme } from './hooks/useTheme';
import { SettingsModal } from './components/settings/SettingsModal';
import { useSettings } from './hooks/useSettings';

function App() {
  const { theme } = useTheme();
  const { isSettingsOpen, closeSettings } = useSettings();

  // Set up theme on app initialization
  useEffect(() => {
    // Theme is automatically applied through the useTheme hook
  }, [theme]);

  return (
    <>
      <AppLayout />
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
}

export default App;