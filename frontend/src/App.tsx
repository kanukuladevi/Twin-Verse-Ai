import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { FeatureToggleProvider } from './context/FeatureToggleContext';
import { TwinProvider } from './context/TwinContext';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';

import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { EducationPage } from './pages/Education/EducationPage';
import { CustomerSupportPage } from './pages/CustomerSupport/CustomerSupportPage';
import { HealthcarePage } from './pages/Healthcare/HealthcarePage';
import { BusinessPage } from './pages/Business/BusinessPage';
import { PersonalAssistantPage } from './pages/PersonalAssistant/PersonalAssistantPage';
import { ContentCreationPage } from './pages/ContentCreation/ContentCreationPage';
import { DecisionReportPage } from './pages/DecisionReport/DecisionReportPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const ProtectedLayout: React.FC = () => {
  const { token, loading } = useAuth();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading AI Twin Platform...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <FeatureToggleProvider>
      <TwinProvider>
        <div className="app-shell">
          <Sidebar />
          <div className="main-content">
            <Topbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/customer-support" element={<CustomerSupportPage />} />
                <Route path="/healthcare" element={<HealthcarePage />} />
                <Route path="/business" element={<BusinessPage />} />
                <Route path="/personal-assistant" element={<PersonalAssistantPage />} />
                <Route path="/content-creation" element={<ContentCreationPage />} />
                <Route path="/decision-report/:id" element={<DecisionReportPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
          <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
        </div>
      </TwinProvider>
    </FeatureToggleProvider>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
