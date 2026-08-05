import React from 'react';
import { UserCheck, Globe, LineChart, ShieldAlert, DollarSign, Heart, FileCheck, CheckCircle2 } from 'lucide-react';

interface AgentStep {
  agent: string;
  status: string;
  summary: string;
  details: string;
}

interface AgentTraceVisualizerProps {
  trace: AgentStep[];
  isEvaluating?: boolean;
}

export const AgentTraceVisualizer: React.FC<AgentTraceVisualizerProps> = ({ trace, isEvaluating }) => {
  const agentIcons: Record<string, any> = {
    'Profiler Agent': UserCheck,
    'Domain Specialist Agent': Globe,
    'Analytics & Prediction Agent': LineChart,
    'Risk & Downside Agent': ShieldAlert,
    'Finance & Value Agent': DollarSign,
    'Well-being & Balance Agent': Heart,
    'Explainability & Evidence Agent': FileCheck
  };

  return (
    <div className="card" style={{ background: '#fafafa', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            🤖 Multi-Agent Reasoning Trace (Agentic Graph Execution)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Transparent breakdown of parallel AI agents debating and weighting recommendations.
          </p>
        </div>
        <span className="badge badge-indigo">
          {trace.length} Agents Executed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {trace.map((step, idx) => {
          const Icon = agentIcons[step.agent] || CheckCircle2;
          return (
            <div
              key={idx}
              className="animate-fade-in"
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                animationDelay: `${idx * 0.08}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ padding: '6px', background: 'var(--accent-light)', borderRadius: '6px', color: 'var(--accent-primary)' }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {step.agent}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {step.summary}
              </p>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {step.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
