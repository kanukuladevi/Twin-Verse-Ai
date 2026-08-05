import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import apiClient from '../../api/client';
import { 
  Sparkles, 
  GraduationCap, 
  Headphones, 
  HeartPulse, 
  Briefcase, 
  UserCheck, 
  Video, 
  ArrowRight, 
  PlusCircle, 
  Award,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { greeting, profile } = useTwin();
  const navigate = useNavigate();

  const [decisions, setDecisions] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [newDomain, setNewDomain] = useState('education');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    apiClient.get('/decisions/list')
      .then((res) => setDecisions(res.data))
      .catch((err) => console.error('Failed to load decisions:', err));
  }, []);

  const handleEvaluateNewDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await apiClient.post('/decisions/evaluate', {
        domain: newDomain,
        title: newTitle || `Decision Evaluation: ${newQuery.substring(0, 30)}...`,
        user_query: newQuery
      });
      navigate(`/decision-report/${res.data.id}`);
    } catch (err) {
      console.error('Decision evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const featureCards = [
    { title: 'Education', desc: 'Roadmaps after 10th/Inter, College Predictor, Entrance Guide & AI Mentor', icon: GraduationCap, path: '/education', color: '#4f46e5' },
    { title: 'Customer Support', desc: '24/7 AI Chat, Ticket Routing, Sentiment Detection & Customer Twin', icon: Headphones, path: '/customer-support', color: '#0284c7' },
    { title: 'Healthcare', desc: 'Health Profile, Symptom Triage, Med Tracker, Lab Report OCR & Vitals', icon: HeartPulse, path: '/healthcare', color: '#10b981' },
    { title: 'Business', desc: 'Business Dashboard, Sales ML Forecasts, Inventory & AI Business Advisor', icon: Briefcase, path: '/business', color: '#d97706' },
    { title: 'Personal Assistant', desc: 'Daily Schedule, Smart Reminders, To-Do List, Goal & Habit Tracker', icon: UserCheck, path: '/personal-assistant', color: '#8b5cf6' },
    { title: 'Content Creation', desc: 'Idea Gen, Script Writer, Caption Gen, Schedule & Performance Predictor', icon: Video, path: '/content-creation', color: '#ec4899' },
  ];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Proactive Morning Greeting Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-indigo">Proactive Twin Greeting</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {greeting?.greeting || "Good morning! Your AI Twin is online."}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Primary Goal: <strong>{profile?.goals[0] || 'Become a Data Analyst'}</strong> | Study Streak: <strong>{profile?.personal_memory?.study_streak_days || 5} Days 🔥</strong>
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', background: 'var(--accent-light)', borderRadius: '10px', color: 'var(--accent-primary)' }}>
            <FileText size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Decisions</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{decisions.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', background: 'var(--accent-success-light)', borderRadius: '10px', color: 'var(--accent-success)' }}>
            <Award size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Confidence</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>89.4%</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', background: 'var(--accent-warning-light)', borderRadius: '10px', color: 'var(--accent-warning)' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Agents Executed</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>7 Active</h3>
          </div>
        </div>
      </div>

      {/* Evaluate New Decision Trigger Form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <PlusCircle size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Evaluate a New Personal or Career Decision
          </h3>
        </div>

        <form onSubmit={handleEvaluateNewDecision}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '14px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Select Domain</label>
              <select className="select-field" value={newDomain} onChange={(e) => setNewDomain(e.target.value)}>
                <option value="education">🎓 Education & Career</option>
                <option value="healthcare">🏥 Health & Wellness</option>
                <option value="business">💼 Business Growth</option>
                <option value="content">📱 Content Strategy</option>
                <option value="personal">🤖 Personal Assistant</option>
              </select>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Decision Title</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Choosing between B.Tech Data Science vs CA Foundation"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Describe your situation & dilemma in detail</label>
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="e.g. I am in 10th class / Inter. I am interested in coding and math. My budget is medium. Should I choose MPC or MEC?"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }} disabled={isEvaluating}>
            <span>{isEvaluating ? 'Multi-Agent Graph Reasoning in Progress...' : 'Simulate & Evaluate Decision'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* 6 Major Feature Modules Quick Access */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Explore 6 Major AI Twin Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.path}
                className="card"
                onClick={() => navigate(feat.path)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: `${feat.color}15`, color: feat.color }}>
                    <Icon size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {feat.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {feat.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: feat.color }}>
                  <span>Open Feature Engine</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Evaluated Decision Reports */}
      {decisions.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Recent Decision Reports
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {decisions.map((dec) => (
              <div
                key={dec.id}
                onClick={() => navigate(`/decision-report/${dec.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className="badge badge-indigo">{dec.domain.toUpperCase()}</span>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {dec.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Evaluated: {new Date(dec.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                    {dec.confidence_score}% Confidence
                  </span>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
