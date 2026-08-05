import React from 'react';
import { Download, AlertTriangle, CheckCircle, ShieldAlert, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AgentTraceVisualizer } from './AgentTraceVisualizer';

interface DecisionReportViewProps {
  decision: any;
}

export const DecisionReportView: React.FC<DecisionReportViewProps> = ({ decision }) => {
  if (!decision) return null;

  const chartData = decision.scored_options?.map((opt: any) => ({
    title: opt.title.split('→')[0].substring(0, 18) + '...',
    Score: opt.score,
    FitToGoal: opt.fit_to_goal
  })) || [];

  const handleDownloadPDF = () => {
    window.open(`http://localhost:8000/decisions/${decision.id}/export-pdf`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            Domain: {decision.domain?.toUpperCase()}
          </span>
          <button className="btn" onClick={handleDownloadPDF} style={{ background: 'white', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
            <Download size={16} />
            <span>Export Official PDF Report</span>
          </button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          {decision.title}
        </h2>
        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          Query: "{decision.user_query}"
        </p>

        {/* Confidence score gauge pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
          <Award size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Multi-Agent Consensus Confidence: {decision.confidence_score}%
          </span>
        </div>
      </div>

      {/* Top Recommendation Highlight Card */}
      <div className="card" style={{ borderLeft: '5px solid var(--accent-success)', background: 'var(--accent-success-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-success)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
          <CheckCircle size={18} />
          <span>TOP AI TWIN RECOMMENDATION</span>
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {decision.top_recommendation}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {decision.why_explanation}
        </p>
      </div>

      {/* Visual Analytics Chart & Radar Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            📊 Option Ranking & Score Comparison
          </h4>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="Score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            🎯 Multi-Criteria Alignment Fit
          </h4>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="FitToGoal" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Side-by-Side Option Breakdown Cards */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
          ⚖️ Side-by-Side Evaluated Options
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {decision.scored_options?.map((opt: any, idx: number) => (
            <div
              key={opt.id || idx}
              className="card"
              style={{
                border: idx === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              {idx === 0 && (
                <span className="badge badge-indigo" style={{ position: 'absolute', top: '-10px', right: '16px' }}>
                  Rank #1 Winner
                </span>
              )}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                {opt.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {opt.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '12px' }}>
                <div><strong>Score:</strong> {opt.score}/100</div>
                <div><strong>Fit:</strong> {opt.fit_to_goal}%</div>
                <div><strong>Cost:</strong> {opt.cost_level}</div>
                <div><strong>Benefit:</strong> {opt.benefit}</div>
              </div>

              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: 'var(--accent-success)' }}>Pros:</strong>
                {opt.pros?.map((p: string, pIdx: number) => (
                  <span key={pIdx} style={{ color: 'var(--text-secondary)' }}>• {p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Downside Scenarios */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldAlert size={18} />
          <span>Identified Risks & Downside Precautions</span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {decision.risks_and_tradeoffs?.map((risk: string, rIdx: number) => (
            <div key={rIdx} style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} style={{ color: 'var(--accent-warning)', flexShrink: 0 }} />
              <span>{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Timeline Tree */}
      <div className="card">
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
          🗺️ Recommended Execution Timeline Roadmap
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {decision.timeline_steps?.map((step: any, sIdx: number) => (
            <div key={sIdx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {sIdx + 1}
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {step.phase}
                </span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {step.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Agent Reasoning Trace */}
      <AgentTraceVisualizer trace={decision.agent_trace || []} />

      {/* Retrieved Domain Citations */}
      {decision.citations && decision.citations.length > 0 && (
        <div className="card">
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>
            📚 Evidence Sources & RAG Citations
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {decision.citations.map((c: any, cIdx: number) => (
              <a key={cIdx} href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                <span>{c.title}</span>
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
