import React, { useState } from 'react';
import { Eye, EyeOff, Key, Palette, Type, Save, RotateCcw, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useSettings } from '../../hooks/useSettings';
import { openRouterModels } from '../../data/models';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(settings.openRouterApiKey);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  
  React.useEffect(() => {
    setTempApiKey(settings.openRouterApiKey);
  }, [settings.openRouterApiKey]);

  const handleSaveApiKey = async () => {
    setIsSaving(true);
    try {
      updateSetting('openRouterApiKey', tempApiKey);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      setTempApiKey('');
    }
  };

  const handleSaveAndClose = () => {
    if (tempApiKey !== settings.openRouterApiKey) {
      updateSetting('openRouterApiKey', tempApiKey);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="space-y-8">
        {/* API Configuration */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              API Configuration
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OpenRouter API Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    disabled={tempApiKey === settings.openRouterApiKey || isSaving}
                    className="p-1 rounded bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white transition-colors disabled:cursor-not-allowed"
                    aria-label="Save API key"
                  >
                    {showSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your API key from{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  OpenRouter Dashboard
                </a>
                . Your key is stored locally and never sent to our servers.
              </p>
              {showSaved && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  API key saved successfully!
                </p>
              )}
            </div>

            <div>
              <label htmlFor="default-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Model
              </label>
              <select
                id="default-model"
                value={settings.defaultModel}
                onChange={(e) => updateSetting('defaultModel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {openRouterModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Appearance
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'system')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select
                id="font-size"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value as 'sm' | 'md' | 'lg')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Type className="w-5 h-5 text-success-600 dark:text-success-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Preferences
            </h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Auto-save conversations
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save chat history to local storage
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTimestamps}
                onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Show message timestamps
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display time when each message was sent
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndClose}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}