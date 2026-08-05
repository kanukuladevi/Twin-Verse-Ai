import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

interface FeatureToggleContextType {
  toggles: Record<string, boolean>;
  isFeatureEnabled: (key: string) => boolean;
  setToggle: (key: string, enabled: boolean) => Promise<void>;
  reloadToggles: () => Promise<void>;
}

const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

export const FeatureToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const reloadToggles = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/features/toggles');
      setToggles(res.data);
    } catch (err) {
      console.error('Failed to load feature toggles:', err);
    }
  };

  useEffect(() => {
    reloadToggles();
  }, [token]);

  const isFeatureEnabled = (key: string): boolean => {
    if (toggles[key] === undefined) return true; // Default enabled
    return toggles[key];
  };

  const setToggle = async (key: string, enabled: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: enabled }));
    try {
      await apiClient.post('/features/toggle', { feature_key: key, enabled });
    } catch (err) {
      console.error('Failed to set toggle:', err);
      reloadToggles();
    }
  };

  return (
    <FeatureToggleContext.Provider value={{ toggles, isFeatureEnabled, setToggle, reloadToggles }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatureToggle = () => {
  const context = useContext(FeatureToggleContext);
  if (!context) throw new Error('useFeatureToggle must be used within FeatureToggleProvider');
  return context;
};
