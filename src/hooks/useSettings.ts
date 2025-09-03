import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Settings } from '../types';

const defaultSettings: Settings = {
  openRouterApiKey: '',
  defaultModel: 'anthropic/claude-3.5-sonnet',
  theme: 'system',
  fontSize: 'md',
  autoSave: true,
  showTimestamps: true,
};

export function useSettings() {
  const [settings, setStoredSettings] = useLocalStorage<Settings>('vesserin-settings', defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setStoredSettings(prev => ({ ...prev, [key]: value }));
  }, [setStoredSettings]);

  const resetSettings = useCallback(() => {
    setStoredSettings(defaultSettings);
  }, [setStoredSettings]);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const isApiKeyConfigured = Boolean(settings.openRouterApiKey?.trim());

  return {
    settings,
    updateSetting,
    resetSettings,
    isSettingsOpen,
    openSettings,
    closeSettings,
    isApiKeyConfigured,
  };
}