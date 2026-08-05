import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { Briefcase, TrendingUp, Package, DollarSign, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const BusinessPage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  const [dashboard, setDashboard] = useState<any>(null);
  const [salesAnalysis, setSalesAnalysis] = useState<any>(null);
  const [advisorMessage, setAdvisorMessage] = useState<any>(null);

  // New Sale Record Form
  const [productName, setProductName] = useState('Blue Cotton Shirts');
  const [category, setCategory] = useState('Apparel');
  const [quantity, setQuantity] = useState(12);
  const [revenue, setRevenue] = useState(1440);
  const [stockRemaining, setStockRemaining] = useState(8);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = () => {
    apiClient.get('/business/dashboard').then(res => setDashboard(res.data)).catch(() => {});
    apiClient.get('/business/sales-analysis').then(res => setSalesAnalysis(res.data)).catch(() => {});
    apiClient.get('/business/ai-advisor').then(res => setAdvisorMessage(res.data)).catch(() => {});
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/business/sales/add', {
        product_name: productName,
        category,
        quantity_sold: Number(quantity),
        revenue: Number(revenue),
        stock_remaining: Number(stockRemaining)
      });
      fetchBusinessData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase style={{ color: '#d97706' }} />
          <span>AI Twin for Business Operations & Sales Growth</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Understands sales, inventory, expenses, and customer trends to give actionable decision advice.
        </p>
      </div>

      {/* AI Business Advisor Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', borderLeft: '4px solid #d97706' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={18} />
          <span>AI BUSINESS CONSULTANT ADVICE</span>
        </div>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {advisorMessage?.advisor_recommendation || "Good morning! Your sales increased by 15.4% this week. Blue Cotton Shirts and Chocolate Cakes are selling fastest. Reorder 35 units today."}
        </p>
        <div style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 700, marginTop: '6px' }}>
          Potential Revenue Lift: {advisorMessage?.potential_impact || "+$2,100 next weekend"}
        </div>
      </div>

      {/* Business KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>${dashboard?.total_revenue || '48,250'}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Profit</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-success)' }}>${dashboard?.net_profit || '18,335'}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dashboard?.total_orders || '340'}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profit Margin</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#d97706' }}>{dashboard?.profit_margin || '38%'}</h3>
        </div>
      </div>

      {/* Sales Analysis Chart & Inventory Alerts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Sales Chart */}
        <div className={`card ${!isFeatureEnabled('biz_sales_analysis') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#d97706' }} />
            <span>Weekly Sales Trend & ML Forecast</span>
          </h3>

          {salesAnalysis?.sales_by_day && (
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesAnalysis.sales_by_day}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Inventory Restock Alerts */}
        <div className={`card ${!isFeatureEnabled('biz_inventory') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} style={{ color: '#d97706' }} />
            <span>Inventory Restock Alerts</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dashboard?.low_stock_alerts?.map((item: any, idx: number) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--accent-warning-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-warning)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.product}</strong>
                  <span className="badge badge-warning">Only {item.remaining} left</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Restock Suggestion: Order 30+ units immediately to prevent weekend stock-out.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record New Sale Entry Form */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
          ➕ Record Sales Entry & Update Inventory
        </h3>
        <form onSubmit={handleAddSale} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div>
            <label className="input-label">Product Name</label>
            <input type="text" className="input-field" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div>
            <label className="input-label">Category</label>
            <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div>
            <label className="input-label">Quantity Sold</label>
            <input type="number" className="input-field" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          </div>
          <div>
            <label className="input-label">Revenue ($)</label>
            <input type="number" className="input-field" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} required />
          </div>
          <div>
            <label className="input-label">Stock Remaining</label>
            <input type="number" className="input-field" value={stockRemaining} onChange={(e) => setStockRemaining(Number(e.target.value))} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
            Record Sale
          </button>
        </form>
      </div>
    </div>
  );
};
