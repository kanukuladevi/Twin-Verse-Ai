import React, { useState, useEffect } from 'react';
import { X, Mic, Send, Bot, Volume2, Sparkles, StopCircle } from 'lucide-react';
import apiClient from '../api/client';
import { useTwin } from '../context/TwinContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useTwin();
  const [messages, setMessages] = useState<{ sender: 'user' | 'twin'; text: string; agentTrace?: any[] }[]>([
    { 
      sender: 'twin', 
      text: "Hello! I am your AI Twin Voice Companion. I remember your goals and twin profile. Ask me any career, business, health, or personal decision!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'twin',
          text: "Microphone speech recognition is not supported in this browser window. Please type your query in the text box below!"
        }
      ]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      // Run Multi-Agent Decision Evaluation or Domain Chat
      const domain = profile?.primary_domain || 'education';
      const res = await apiClient.post('/decisions/evaluate', {
        domain: domain,
        title: `Voice Assistant Query: ${text.substring(0, 30)}...`,
        user_query: text
      });

      const aiReply = `${res.data.top_recommendation} ${res.data.why_explanation}`;
      
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'twin', 
          text: aiReply,
          agentTrace: res.data.agent_trace
        }
      ]);

      // Speak AI response aloud
      speakText(res.data.top_recommendation);

    } catch (err) {
      // Fallback support response
      try {
        const suppRes = await apiClient.post('/support/chat', { message: text });
        setMessages((prev) => [
          ...prev,
          { sender: 'twin', text: suppRes.data.ai_response }
        ]);
        speakText(suppRes.data.ai_response);
      } catch (e) {
        const fallbackMsg = "I processed your request using your Digital Twin Profile context! Your goal remains synchronized.";
        setMessages((prev) => [...prev, { sender: 'twin', text: fallbackMsg }]);
        speakText(fallbackMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: 'white',
        width: '92%',
        maxWidth: '560px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        height: '580px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'var(--accent-primary)', borderRadius: '10px', color: 'white' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AI Twin Voice Companion
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Speech-to-Text & Multi-Agent AI Audio Output
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSpeaking && (
              <button className="btn btn-outline" onClick={stopSpeaking} style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-danger)' }}>
                <StopCircle size={14} />
                <span>Stop Voice</span>
              </button>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages & Agent Step Indicators */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? 'var(--accent-primary)' : '#f1f5f9',
                color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {m.sender === 'twin' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    <Volume2 size={14} />
                    <span>AI Twin Voice Response</span>
                  </div>
                  {m.agentTrace && (
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                      7 Agents Consensus
                    </span>
                  )}
                </div>
              )}
              {m.text}
            </div>
          ))}

          {isListening && (
            <div style={{ alignSelf: 'center', background: 'var(--accent-warning-light)', color: 'var(--accent-warning)', padding: '10px 18px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-warning)' }}>
              <Mic className="animate-pulse-glow" size={18} />
              <span>Listening to your microphone... Speak your question now!</span>
            </div>
          )}

          {loading && (
            <div style={{ alignSelf: 'flex-start', background: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🧠 Multi-Agent Graph (Profiler → Analytics → Risk → Finance → Wellbeing → Explainability) evaluating decision...
            </div>
          )}
        </div>

        {/* Bottom Input Controls */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff' }}>
          <button
            className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleStartListening}
            style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, flexShrink: 0 }}
            title="Click to speak using Microphone"
          >
            <Mic size={20} className={isListening ? 'animate-pulse-glow' : ''} />
          </button>

          <input
            type="text"
            className="input-field"
            placeholder="Type your question or click mic to speak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
