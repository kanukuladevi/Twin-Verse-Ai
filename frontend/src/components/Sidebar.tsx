import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Headphones, 
  HeartPulse, 
  Briefcase, 
  UserCheck, 
  Video, 
  Settings, 
  Bot,
  Sparkles
} from 'lucide-react';
import { useTwin } from '../context/TwinContext';

export const Sidebar: React.FC = () => {
  const { profile } = useTwin();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Education', path: '/education', icon: GraduationCap, badge: 'Students' },
    { label: 'Customer Support', path: '/customer-support', icon: Headphones, badge: 'Support' },
    { label: 'Healthcare', path: '/healthcare', icon: HeartPulse, badge: 'Wellness' },
    { label: 'Business', path: '/business', icon: Briefcase, badge: 'Growth' },
    { label: 'Personal Assistant', path: '/personal-assistant', icon: UserCheck, badge: 'Daily' },
    { label: 'Content Creation', path: '/content-creation', icon: Video, badge: 'Creators' },
  ];

  return (
    <aside className="sidebar">
      {/* App Brand Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
        }}>
          <Bot size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            AI Twin
          </h1>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Decision Platform
          </span>
        </div>
      </div>

      {/* Digital Twin Status Box */}
      <div style={{ padding: '16px 20px', margin: '16px 14px', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            Digital Twin Active
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Domain: <span style={{ color: 'var(--text-primary)', fontWeight: 700, textTransform: 'capitalize' }}>{profile?.primary_domain || 'Education'}</span>
        </p>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px 4px 10px' }}>
          Core Features
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Settings Link */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-color)' }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: isActive ? 700 : 600,
            fontSize: '0.88rem',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
          })}
        >
          <Settings size={18} />
          <span>Settings & Toggles</span>
        </NavLink>
      </div>
    </aside>
  );
};
