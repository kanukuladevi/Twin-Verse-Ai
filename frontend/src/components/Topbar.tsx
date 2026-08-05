import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTwin } from '../context/TwinContext';
import { Search, Mic, LogOut, User, Sparkles } from 'lucide-react';

interface TopbarProps {
  onOpenVoiceModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenVoiceModal }) => {
  const { user, logout } = useAuth();
  const { profile } = useTwin();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="topbar">
      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '380px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}>
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Ask AI Twin a decision or search feature..."
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
        />
      </div>

      {/* Right Controls & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Voice Assistant Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenVoiceModal}
          style={{ padding: '6px 12px', fontSize: '0.82rem' }}
        >
          <Mic size={16} />
          <span>Voice Twin</span>
        </button>

        {/* Memory Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid #e2e8f0' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse-glow" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Twin Memory Synced
          </span>
        </div>

        {/* User Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.email || 'user@aitwin.com'}
              </span>
            </div>
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '200px',
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Style: <strong>{profile?.communication_style || 'Encouraging'}</strong>
              </div>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--accent-danger)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
