import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { DecisionReportView } from '../../components/DecisionReportView';
import { ArrowLeft } from 'lucide-react';

export const DecisionReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.get(`/decisions/${id}`)
        .then((res) => setDecision(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Loading AI Twin Multi-Agent Decision Report...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button className="btn btn-outline" onClick={() => navigate('/dashboard')} style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.82rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <DecisionReportView decision={decision} />
    </div>
  );
};
