import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { updateProfile } = useTwin();
  const navigate = useNavigate();

  const [primaryDomain, setPrimaryDomain] = useState('education');
  const [goal, setGoal] = useState('Become a Data Analyst / AI Engineer');
  const [stream, setStream] = useState('MPC');
  const [budget, setBudget] = useState('Medium');
  const [jobPref, setJobPref] = useState('Private');
  const [style, setStyle] = useState('Encouraging & Direct');

  const handleSave = async () => {
    await updateProfile({
      primary_domain: primaryDomain,
      goals: [goal, "Maintain low stress", "Save money"],
      budget: budget,
      job_preference: jobPref,
      communication_style: style,
      education_memory: { stream: stream, target: goal }
    });
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
          <Sparkles size={18} />
          <span>ONBOARDING STEP 1 OF 1</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Seed Your AI Twin Memory Profile
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Your AI Twin will use these preferences to customize decision evaluations, proactive daily briefs, and multi-agent reasoning.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="input-group">
            <label className="input-label">Select Primary Focus Area</label>
            <select className="select-field" value={primaryDomain} onChange={(e) => setPrimaryDomain(e.target.value)}>
              <option value="education">🎓 Education (AI Twin for Students)</option>
              <option value="support">🎧 Customer Support (Personalized Support)</option>
              <option value="healthcare">🏥 Healthcare (Health & Wellness Twin)</option>
              <option value="business">💼 Business (Business Decision Twin)</option>
              <option value="personal">🤖 Personal Assistant (Digital Self)</option>
              <option value="content">📱 Content Creation (Creator Strategist)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">What is your #1 Priority Goal?</label>
            <input
              type="text"
              className="input-field"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Become a Data Analyst or Scale sales by 20%"
            />
          </div>

          {primaryDomain === 'education' && (
            <div className="input-group">
              <label className="input-label">Current Academic Stream (or interest)</label>
              <select className="select-field" value={stream} onChange={(e) => setStream(e.target.value)}>
                <option value="MPC">MPC (Maths, Physics, Chemistry)</option>
                <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                <option value="HEC">HEC (History, Economics, Civics)</option>
                <option value="Diploma">Polytechnic Diploma</option>
                <option value="ITI">ITI Vocational Training</option>
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Financial Budget Constraint</label>
              <select className="select-field" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="Low">Low / Cost-Conscious</option>
                <option value="Medium">Medium / Standard</option>
                <option value="High">High / Flexible</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Career Target Sector</label>
              <select className="select-field" value={jobPref} onChange={(e) => setJobPref(e.target.value)}>
                <option value="Private">Private Corporate / Tech</option>
                <option value="Government">Government / Public Sector</option>
                <option value="Entrepreneurship">Entrepreneurship / Self-Employed</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">AI Twin Communication Tone</label>
            <select className="select-field" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="Encouraging & Direct">Encouraging & Direct (Recommended)</option>
              <option value="Analytical & Strict">Analytical & Data-Heavy</option>
              <option value="Casual & Friendly">Casual & Friendly</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', padding: '12px', marginTop: '24px' }}>
          <span>Save Twin Profile & Launch Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
