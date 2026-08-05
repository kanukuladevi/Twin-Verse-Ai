import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { HeartPulse, Stethoscope, Activity, FileSpreadsheet, AlertTriangle, FileText, Plus, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const HealthcarePage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  // Symptom Triage State
  const [symptoms, setSymptoms] = useState('Headache, Fatigue, Mild Fever');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('Mild');
  const [triageResult, setTriageResult] = useState<any>(null);
  const [loadingTriage, setLoadingTriage] = useState(false);

  // Vitals State
  const [bpSys, setBpSys] = useState(120);
  const [bpDia, setBpDia] = useState(80);
  const [sugar, setSugar] = useState(98);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);

  // Report Analyzer State
  const [reportTitle, setReportTitle] = useState('Lipid & Fasting Sugar Panel');
  const [reportResult, setReportResult] = useState<any>(null);

  // Doctor Summary State
  const [doctorSummary, setDoctorSummary] = useState<any>(null);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = () => {
    apiClient.get('/healthcare/vitals/history').then(res => setVitalsHistory(res.data)).catch(() => {});
  };

  const handleRunTriage = async () => {
    setLoadingTriage(true);
    try {
      const res = await apiClient.post('/healthcare/symptom-triage', {
        symptoms: symptoms.split(',').map(s => s.trim()),
        duration,
        severity
      });
      setTriageResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTriage(false);
    }
  };

  const handleLogVital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/healthcare/vitals/log', {
        bp_sys: Number(bpSys),
        bp_dia: Number(bpDia),
        sugar_fasting: Number(sugar),
        steps: 8200,
        sleep_hours: 7.5
      });
      fetchVitals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeReport = async () => {
    try {
      const res = await apiClient.post(`/healthcare/report-analyzer?title=${encodeURIComponent(reportTitle)}`);
      setReportResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateDoctorSummary = async () => {
    try {
      const res = await apiClient.get('/healthcare/doctor-summary');
      setDoctorSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const vitalsChartData = vitalsHistory.slice(0, 7).reverse().map(v => ({
    time: new Date(v.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    SystolicBP: v.bp_sys,
    FastingSugar: v.sugar_fasting
  }));

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HeartPulse style={{ color: '#10b981' }} />
          <span>Health & Wellness Digital Twin</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Personalized health profile tracking, symptom triage, lab report RAG analyzer, and vitals trend monitoring.
        </p>
      </div>

      {/* Mandatory Medical Disclaimer Alert */}
      <div style={{ background: 'var(--accent-warning-light)', border: '1px solid var(--accent-warning)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#92400e', fontWeight: 600 }}>
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>DISCLAIMER:</strong> AI Twin Health guidance is for informational and educational support only. It is not a clinical diagnosis. In case of severe chest pain or emergency, contact emergency medical services immediately.
        </span>
      </div>

      {/* Health Twin Coach Proactive Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
          🩺 Health Twin Coach Proactive Guidance
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          "Your Blood Pressure readings have been optimal for 5 consecutive days! Continue your daily 8,000 steps habit and stay hydrated."
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Symptom Triage Form */}
        <div className={`card ${!isFeatureEnabled('health_symptom_triage') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={18} style={{ color: '#10b981' }} />
            <span>Symptom Analysis & Triage</span>
          </h3>

          <div className="input-group">
            <label className="input-label">Describe Symptoms (comma separated)</label>
            <input type="text" className="input-field" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="input-group">
              <label className="input-label">Duration</label>
              <select className="select-field" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="Less than 24 hrs">Less than 24 hrs</option>
                <option value="1-3 days">1-3 days</option>
                <option value="Over a week">Over a week</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Severity Level</label>
              <select className="select-field" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleRunTriage} disabled={loadingTriage} style={{ width: '100%' }}>
            {loadingTriage ? 'Analyzing Clinical Rules...' : 'Analyze Symptoms & Triage'}
          </button>

          {triageResult && (
            <div style={{ marginTop: '16px', padding: '14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span className={`badge ${triageResult.urgency_level.includes('Emergency') ? 'badge-danger' : 'badge-indigo'}`}>
                {triageResult.urgency_level}
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px' }}>
                {triageResult.triage_recommendation}
              </h4>
            </div>
          )}
        </div>

        {/* Vitals Log & Trend Graph */}
        <div className={`card ${!isFeatureEnabled('health_vitals_dashboard') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#10b981' }} />
            <span>Vitals Dashboard & Logging</span>
          </h3>

          <form onSubmit={handleLogVital} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label className="input-label">Systolic BP</label>
              <input type="number" className="input-field" value={bpSys} onChange={(e) => setBpSys(Number(e.target.value))} />
            </div>
            <div>
              <label className="input-label">Diastolic BP</label>
              <input type="number" className="input-field" value={bpDia} onChange={(e) => setBpDia(Number(e.target.value))} />
            </div>
            <div>
              <label className="input-label">Sugar mg/dL</label>
              <input type="number" className="input-field" value={sugar} onChange={(e) => setSugar(Number(e.target.value))} />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ gridColumn: 'span 3', padding: '6px' }}>
              Log Vital Reading
            </button>
          </form>

          {vitalsChartData.length > 0 && (
            <div style={{ height: '180px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsChartData}>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="SystolicBP" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="FastingSugar" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Lab Report Analyzer & Doctor Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Lab Report Analyzer */}
        <div className={`card ${!isFeatureEnabled('health_report_analyzer') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} style={{ color: '#10b981' }} />
            <span>Health Report RAG & OCR Analyzer</span>
          </h3>

          <div className="input-group">
            <label className="input-label">Upload / Select Lab Report Title</label>
            <input type="text" className="input-field" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
          </div>

          <button className="btn btn-primary" onClick={handleAnalyzeReport} style={{ width: '100%', marginBottom: '14px' }}>
            Simulate OCR & Extract Findings
          </button>

          {reportResult && (
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <strong>Flagged Out-of-Range Metrics:</strong>
              {reportResult.flagged_metrics?.map((f: any, idx: number) => (
                <div key={idx} style={{ color: 'var(--accent-danger)', fontWeight: 600, margin: '4px 0' }}>
                  • {f.metric}: {f.value} ({f.status})
                </div>
              ))}
              <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>{reportResult.summary}</p>
            </div>
          )}
        </div>

        {/* Doctor Summary Generator */}
        <div className={`card ${!isFeatureEnabled('health_doctor_summary') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: '#10b981' }} />
            <span>Export Doctor Consultation Summary</span>
          </h3>

          <button className="btn btn-secondary" onClick={handleGenerateDoctorSummary} style={{ width: '100%', marginBottom: '14px' }}>
            Generate Summary for Physician
          </button>

          {doctorSummary && (
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {doctorSummary.summary_text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
