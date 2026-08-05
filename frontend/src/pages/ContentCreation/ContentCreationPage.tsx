import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { Video, Sparkles, Wand2, BarChart2, Clock, ThumbsUp, Copy, Check } from 'lucide-react';

export const ContentCreationPage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  const [niche, setNiche] = useState('Tech & AI');
  const [topic, setTopic] = useState('How Multi-Agent AI Twins Work in 2026');
  const [tone, setTone] = useState('Engaging & Educational');
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient.get('/content/analytics').then(res => setAnalytics(res.data)).catch(() => {});
  }, []);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/content/generate', {
        niche,
        contentType: 'Reel',
        topic,
        target_tone: tone
      });
      setGeneratedPost(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyScript = () => {
    if (generatedPost?.full_script) {
      navigator.clipboard.writeText(generatedPost.full_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Video style={{ color: '#ec4899' }} />
          <span>AI Twin for Content Creators: Digital Content Strategist</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          "Create smarter, post at the right time, and grow faster with your AI Twin."
        </p>
      </div>

      {/* Growth Coach Advice Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #ffffff 100%)', borderLeft: '4px solid #ec4899' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={18} />
          <span>CREATOR GROWTH COACH ADVICE</span>
        </div>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {analytics?.growth_coach_advice || "Good morning! Your audience is most active at 7 PM today. You haven't posted in two days. An AI tutorial video is likely to get higher engagement."}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Content Idea & Script Generator Form */}
        <div className={`card ${!isFeatureEnabled('cnt_idea_generator') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={18} style={{ color: '#ec4899' }} />
            <span>Generate Script, Hook & Captions</span>
          </h3>

          <form onSubmit={handleGenerateContent}>
            <div className="input-group">
              <label className="input-label">Content Niche</label>
              <select className="select-field" value={niche} onChange={(e) => setNiche(e.target.value)}>
                <option value="Tech & AI">Tech & AI Projects</option>
                <option value="Travel">Travel & Vlogging</option>
                <option value="Dance & Music">Dance & Entertainment</option>
                <option value="Education">Education & Study Tips</option>
                <option value="Fitness">Fitness & Wellness</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Topic / Keyword</label>
              <input type="text" className="input-field" value={topic} onChange={(e) => setTopic(e.target.value)} required />
            </div>

            <div className="input-group">
              <label className="input-label">Target Tone</label>
              <select className="select-field" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="Engaging & Motivational">Engaging & Motivational</option>
                <option value="Funny & Casual">Funny & Casual</option>
                <option value="Professional & Technical">Professional & Technical</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#ec4899' }} disabled={loading}>
              {loading ? 'Crafting Viral Script & Captions...' : 'Generate Full Content Kit'}
            </button>
          </form>
        </div>

        {/* Audience & Performance Analytics Widget */}
        <div className={`card ${!isFeatureEnabled('cnt_performance_predictor') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: '#ec4899' }} />
            <span>Audience Analytics & Active Hours</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Followers Count</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{analytics?.active_followers || 24500}</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-success)', fontWeight: 600 }}>{analytics?.follower_growth_rate}</span>
            </div>

            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Peak Active Hours Today</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ec4899', marginTop: '2px' }}>
                7:00 PM - 9:00 PM (Recommended)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Script & Performance Prediction Output */}
      {generatedPost && (
        <div className="card" style={{ border: '2px solid #ec4899' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge badge-indigo">
              ML Engagement Forecast: {generatedPost.predicted_engagement_score}% High
            </span>
            <button className="btn btn-outline" onClick={handleCopyScript} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied Script!' : 'Copy Script'}</span>
            </button>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Title: {generatedPost.topic}
          </h3>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', marginBottom: '14px', whiteSpace: 'pre-wrap', fontSize: '0.88rem' }}>
            {generatedPost.full_script}
          </div>

          <div style={{ background: '#fff1f2', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
            <strong>Suggested Caption & Hashtags:</strong>
            <p style={{ margin: '4px 0', color: 'var(--text-primary)' }}>{generatedPost.caption}</p>
            <p style={{ color: '#ec4899', fontWeight: 700 }}>{generatedPost.hashtags?.join(' ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};
