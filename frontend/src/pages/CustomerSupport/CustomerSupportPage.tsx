import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { Headphones, Send, AlertTriangle, Truck, Sparkles, MessageSquare, Bot } from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Complaint Form
  const [category, setCategory] = useState('Payment');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);

  // Order Tracking
  const [orderId, setOrderId] = useState('ORD-98421');
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    apiClient.get('/support/complaints/list').then(res => setTickets(res.data)).catch(() => {});
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatLogs((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoadingChat(true);

    try {
      const res = await apiClient.post('/support/chat', { message: userMsg });
      setChatLogs((prev) => [
        ...prev,
        {
          sender: 'twin',
          text: res.data.ai_response,
          sentiment: res.data.sentiment_detected,
          department: res.data.routed_department,
          priority: res.data.priority_level
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/support/complaints/create', { category, subject, description });
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrackOrder = async () => {
    try {
      const res = await apiClient.get('/support/order-tracking', { params: { order_id: orderId } });
      setOrderInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHandoff = async (ticketId: number) => {
    try {
      await apiClient.post(`/support/human-handoff/${ticketId}`);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Headphones style={{ color: '#0284c7' }} />
          <span>Personalized Customer Twin Support</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          24/7 Intelligent Support with Customer Twin Memory, Sentiment Detection, and Smart Routing.
        </p>
      </div>

      {/* Customer Twin Memory Greeting Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)', borderLeft: '4px solid #0284c7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={18} />
          <span>CUSTOMER DIGITAL TWIN MEMORY</span>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          "Welcome back! Last week you reported a payment issue, and it was resolved. Is everything working fine now, or do you need help with something else?"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* 24/7 AI Chat Window */}
        <div className={`card ${!isFeatureEnabled('supp_247_ai') ? 'card-disabled' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            💬 24/7 AI Support Chat
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {chatLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: log.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: log.sender === 'user' ? 'var(--accent-primary)' : '#f1f5f9',
                  color: log.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem'
                }}
              >
                {log.sender === 'twin' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.72rem', fontWeight: 700, color: '#0284c7' }}>
                    <Bot size={13} />
                    <span>Customer Twin [{log.department}]</span>
                  </div>
                )}
                {log.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Ask about orders, refunds, payment..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loadingChat}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Complaint Management & Ticket Creation */}
        <div className={`card ${!isFeatureEnabled('supp_complaints') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            📝 Raise a Complaint (Auto-Categorization & Smart Routing)
          </h3>

          <form onSubmit={handleCreateTicket} style={{ marginBottom: '16px' }}>
            <div className="input-group">
              <label className="input-label">Issue Category</label>
              <select className="select-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Payment">Payment & Billing</option>
                <option value="Order">Order Fulfillment</option>
                <option value="Technical">Technical Bug</option>
                <option value="Delivery">Delivery Delay</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Subject</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Payment debited but order not confirmed"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="textarea-field"
                rows={2}
                placeholder="Details of your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit Complaint
            </button>
          </form>
        </div>
      </div>

      {/* Tickets & Human Agent Handoff List */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
          🎫 Your Active Support Tickets & Human Handoff Status
        </h3>

        {tickets.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No active complaints logged.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tickets.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span className="badge badge-indigo">{t.ticket_number}</span>
                    <strong style={{ fontSize: '0.9rem' }}>{t.subject}</strong>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Department: <strong>{t.department}</strong> | Priority: <strong>{t.priority}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${t.status.includes('Handed') ? 'badge-warning' : 'badge-success'}`}>
                    {t.status}
                  </span>
                  {!t.status.includes('Handed') && (
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => handleHandoff(t.id)}>
                      Handoff to Human
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
