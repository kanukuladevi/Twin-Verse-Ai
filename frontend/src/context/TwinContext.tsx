import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

interface TwinProfile {
  primary_domain: string;
  goals: string[];
  interests: string[];
  strengths: string[];
  budget: string;
  job_preference: string;
  education_memory: any;
  health_memory: any;
  business_memory: any;
  personal_memory: any;
  content_memory: any;
  customer_memory: any;
  communication_style: string;
}

interface GreetingData {
  user_name: string;
  time_greeting: string;
  greeting: string;
  primary_domain: string;
  goals_summary: string[];
  twin_memory_status: string;
}

interface TwinContextType {
  profile: TwinProfile | null;
  greeting: GreetingData | null;
  reloadProfile: () => Promise<void>;
  updateProfile: (data: Partial<TwinProfile>) => Promise<void>;
}

const TwinContext = createContext<TwinContextType | undefined>(undefined);

export const TwinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<TwinProfile | null>(null);
  const [greeting, setGreeting] = useState<GreetingData | null>(null);

  const reloadProfile = async () => {
    if (!token) return;
    try {
      const [profRes, greetRes] = await Promise.all([
        apiClient.get('/twin/profile'),
        apiClient.get('/twin/greeting')
      ]);
      setProfile(profRes.data);
      setGreeting(greetRes.data);
    } catch (err) {
      console.error('Failed to load twin profile/greeting:', err);
    }
  };

  useEffect(() => {
    reloadProfile();
  }, [token]);

  const updateProfile = async (data: Partial<TwinProfile>) => {
    try {
      const res = await apiClient.put('/twin/profile', data);
      setProfile(res.data);
      reloadProfile();
    } catch (err) {
      console.error('Failed to update twin profile:', err);
    }
  };

  return (
    <TwinContext.Provider value={{ profile, greeting, reloadProfile, updateProfile }}>
      {children}
    </TwinContext.Provider>
  );
};

export const useTwin = () => {
  const context = useContext(TwinContext);
  if (!context) throw new Error('useTwin must be used within TwinProvider');
  return context;
};
