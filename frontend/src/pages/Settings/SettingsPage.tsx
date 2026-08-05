import React, { useState } from 'react';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { useTwin } from '../../context/TwinContext';
import { Settings as SettingsIcon, Sliders, User, Check, Sparkles } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { toggles, setToggle } = useFeatureToggle();
  const { profile, updateProfile } = useTwin();

  const [primaryDomain, setPrimaryDomain] = useState(profile?.primary_domain || 'education');
  const [goalsStr, setGoalsStr] = useState(profile?.goals?.join(', ') || 'Become a Data Analyst');
  const [commStyle, setCommStyle] = useState(profile?.communication_style || 'Encouraging & Direct');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const featureGroups = [
    {
      group: '🎓 Education Module Features',
      items: [
        { key: 'edu_ai_advisor', name: 'AI Career Advisor Engine' },
        { key: 'edu_roadmaps_10th', name: 'After 10th Stream Roadmaps' },
        { key: 'edu_roadmaps_inter', name: 'After Intermediate Roadmaps' },
        { key: 'edu_college_predictor', name: 'College Predictor Engine' },
        { key: 'edu_entrance_guide', name: 'Entrance Exam Guide' },
        { key: 'edu_skill_roadmaps', name: 'Skill Roadmaps' },
        { key: 'edu_scholarships', name: 'Scholarships & Financial Aid' },
        { key: 'edu_document_checklist', name: 'Document Checklist' },
      ]
    },
    {
      group: '🎧 Customer Support Features',
      items: [
        { key: 'supp_247_ai', name: '24/7 AI Support Chat' },
        { key: 'supp_complaints', name: 'Complaint Management & Tickets' },
        { key: 'supp_order_tracking', name: 'Order & Service Tracking' },
        { key: 'supp_human_handoff', name: 'Human Agent Handoff' },
      ]
    },
    {
      group: '🏥 Healthcare Features',
      items: [
        { key: 'health_symptom_triage', name: 'Symptom Triage Engine' },
        { key: 'health_vitals_dashboard', name: 'Vitals & Trend Dashboard' },
        { key: 'health_report_analyzer', name: 'Lab Report RAG Analyzer' },
        { key: 'health_doctor_summary', name: 'Doctor Handoff Summary' },
      ]
    },
    {
      group: '💼 Business Features',
      items: [
        { key: 'biz_dashboard', name: 'Business Operations Dashboard' },
        { key: 'biz_sales_analysis', name: 'Sales Analysis & ML Forecast' },
        { key: 'biz_inventory', name: 'Inventory Restock Alerts' },
        { key: 'biz_ai_advisor', name: 'AI Business Advisor' },
      ]
    },
    {
      group: '🤖 Personal Assistant Features',
      items: [
        { key: 'ast_daily_schedule', name: 'Daily Schedule Manager' },
        { key: 'ast_todo_list', name: 'To-Do List & Priority Tasks' },
        { key: 'ast_weather_travel', name: 'Weather & Travel Updates' },
        { key: 'ast_habit_tracker', name: 'Habits & Streaks Tracker' },
      ]
    },
    {
      group: '📱 Content Creation Features',
      items: [
        { key: 'cnt_idea_generator', name: 'Content Idea & Script Generator' },
        { key: 'cnt_performance_predictor', name: 'Performance Score Predictor' },
      ]
    }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      primary_domain: primaryDomain,
      goals: goalsStr.split(',').map(g => g.trim()),
      communication_style: commStyle
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SettingsIcon style={{ color: 'var(--accent-primary)' }} />
          <span>AI Twin Settings & Feature Toggles</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Manage your digital twin memory preferences and enable/disable individual app features.
        </p>
      </div>

      {/* Twin Memory Profile Edit Form */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Edit Digital Twin Memory Profile</span>
        </h3>

        {savedSuccess && (
          <div style={{ background: 'var(--accent-success-light)', color: 'var(--accent-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '14px' }}>
            ✓ Twin Profile & Memory successfully updated!
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Primary Active Domain</label>
              <select className="select-field" value={primaryDomain} onChange={(e) => setPrimaryDomain(e.target.value)}>
                <option value="education">Education & Careers</option>
                <option value="customer_support">Customer Support</option>
                <option value="healthcare">Healthcare & Wellness</option>
                <option value="business">Business Operations</option>
                <option value="personal_assistant">Personal Assistant</option>
                <option value="content_creation">Content Creation</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Communication Style</label>
              <select className="select-field" value={commStyle} onChange={(e) => setCommStyle(e.target.value)}>
                <option value="Encouraging & Direct">Encouraging & Direct</option>
                <option value="Analytical & Data-Heavy">Analytical & Data-Heavy</option>
                <option value="Casual & Friendly">Casual & Friendly</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Active Goals (comma-separated)</label>
            <input
              type="text"
              className="input-field"
              value={goalsStr}
              onChange={(e) => setGoalsStr(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Save Twin Memory
          </button>
        </form>
      </div>

      {/* Feature & Option Enable / Disable Controls */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Feature & Option Enable / Disable Controls</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Disabled options are greyed out, non-interactive in the UI, and blocked at the API level.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {featureGroups.map((group, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                {group.group}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.items.map((item) => {
                  const isEnabled = toggles[item.key] !== false; // Default true
                  return (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: isEnabled ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => setToggle(item.key, !isEnabled)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isEnabled ? 'var(--accent-success-light)' : '#e2e8f0',
                          color: isEnabled ? 'var(--accent-success)' : 'var(--text-muted)'
                        }}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
