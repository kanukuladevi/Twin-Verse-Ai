import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { UserCheck, Calendar, CheckSquare, CloudRain, Flame, Plus, Clock, Sparkles } from 'lucide-react';

export const PersonalAssistantPage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  const [scheduleData, setScheduleData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  // New Task State
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState('High');
  const [category, setCategory] = useState('Study');

  useEffect(() => {
    fetchAssistantData();
  }, []);

  const fetchAssistantData = () => {
    apiClient.get('/assistant/daily-schedule').then(res => setScheduleData(res.data)).catch(() => {});
    apiClient.get('/assistant/weather-travel').then(res => setWeatherData(res.data)).catch(() => {});
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    try {
      await apiClient.post('/assistant/tasks/create', {
        title: taskTitle,
        priority,
        category
      });
      setTaskTitle('');
      fetchAssistantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await apiClient.put(`/assistant/tasks/${taskId}/toggle`);
      fetchAssistantData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserCheck style={{ color: '#8b5cf6' }} />
          <span>AI Twin Personal Digital Assistant</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Learns your daily routine, remembers priorities, and proactively manages your daily schedule.
        </p>
      </div>

      {/* Morning Brief Proactive Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)', borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={18} />
          <span>PROACTIVE DAILY BRIEF</span>
        </div>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {scheduleData?.morning_brief || "Good morning, Varshitha! You have 3 primary tasks today. You slept 7.5 hours last night, and your study streak is at 5 days!"}
        </p>
      </div>

      {/* Weather & Travel Widget */}
      {weatherData && (
        <div className={`card ${!isFeatureEnabled('ast_weather_travel') ? 'card-disabled' : ''}`} style={{ background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CloudRain size={20} style={{ color: '#0284c7' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Weather & Travel Alerts — {weatherData.location} ({weatherData.temperature})
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            ☔ <strong>Weather Tip:</strong> {weatherData.weather_tip}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', fontWeight: 600 }}>
            🚗 <strong>Traffic Alert:</strong> {weatherData.traffic_alert}
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Daily Schedule & To-Do List */}
        <div className={`card ${!isFeatureEnabled('ast_daily_schedule') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: '#8b5cf6' }} />
            <span>Today's Daily Schedule & Time Slots</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {scheduleData?.schedule?.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleToggleTask(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: item.completed ? '#f1f5f9' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textDecoration: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.6 : 1
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Time Slot: {item.time_slot}
                  </span>
                </div>
                <span className={`badge ${item.priority === 'High' ? 'badge-danger' : 'badge-indigo'}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleCreateTask} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Add New Schedule Task</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Task title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <select className="select-field" style={{ width: '110px' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Habit Tracker & Streaks Widget */}
        <div className={`card ${!isFeatureEnabled('ast_habit_tracker') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <span>Habit Tracker & Active Streaks</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#fffbeb', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Daily Study & Revision Streak</strong>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#d97706' }}>5 Days 🔥</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Goal: 30 minutes daily practice. Kept streak active for 5 days in a row!
              </p>
            </div>

            <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Water Intake Habit</strong>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>6 / 8 Glasses</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Target: 2.5L daily hydration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
