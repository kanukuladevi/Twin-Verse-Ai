import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useFeatureToggle } from '../../context/FeatureToggleContext';
import { 
  GraduationCap, 
  Sparkles, 
  Map, 
  Search, 
  Award, 
  CheckSquare, 
  FileText, 
  Bot,
  Layers,
  Building2,
  BookOpen
} from 'lucide-react';

export const EducationPage: React.FC = () => {
  const { isFeatureEnabled } = useFeatureToggle();

  const [activeTab, setActiveTab] = useState<'advisor' | 'roadmaps10th' | 'roadmapsInter' | 'colleges' | 'exams' | 'skills' | 'scholarships' | 'docs'>('advisor');

  // AI Advisor State
  const [interests, setInterests] = useState('AI, Programming, Problem Solving');
  const [subjects, setSubjects] = useState('Math, Physics, Computer');
  const [strengths, setStrengths] = useState('Logic, Analytics');
  const [budget, setBudget] = useState('Medium');
  const [jobType, setJobType] = useState('Private');
  const [advisorResult, setAdvisorResult] = useState<any>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // College Predictor State
  const [rank, setRank] = useState(2500);
  const [exam, setExam] = useState('EAMCET');
  const [state, setState] = useState('Telangana');
  const [collegeResults, setCollegeResults] = useState<any[]>([]);

  // Static Data fetched from backend
  const [roadmaps10th, setRoadmaps10th] = useState<any>({});
  const [roadmapsInter, setRoadmapsInter] = useState<any>({});
  const [examsList, setExamsList] = useState<any[]>([]);
  const [skillRoadmaps, setSkillRoadmaps] = useState<any>({});
  const [scholarshipsList, setScholarshipsList] = useState<any[]>([]);
  const [documentChecklist, setDocumentChecklist] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/education/roadmaps-10th').then(res => setRoadmaps10th(res.data)).catch(() => {});
    apiClient.get('/education/roadmaps-inter').then(res => setRoadmapsInter(res.data)).catch(() => {});
    apiClient.get('/education/entrance-exams').then(res => setExamsList(res.data)).catch(() => {});
    apiClient.get('/education/skill-roadmaps').then(res => setSkillRoadmaps(res.data)).catch(() => {});
    apiClient.get('/education/scholarships').then(res => setScholarshipsList(res.data)).catch(() => {});
    apiClient.get('/education/document-checklist').then(res => setDocumentChecklist(res.data)).catch(() => {});
  }, []);

  const handleRunAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const res = await apiClient.post('/education/ai-career-advisor', {
        interests: interests.split(',').map(s => s.trim()),
        subjects: subjects.split(',').map(s => s.trim()),
        strengths: strengths.split(',').map(s => s.trim()),
        budget,
        job_type: jobType
      });
      setAdvisorResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handlePredictColleges = async () => {
    try {
      const res = await apiClient.get('/education/college-predictor', {
        params: { rank, exam, state }
      });
      setCollegeResults(res.data.matched_colleges || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap style={{ color: 'var(--accent-primary)' }} />
            <span>AI Twin for Education & Career Guidance</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Personalized guidance from Class 10th until getting your target high-growth job.
          </p>
        </div>
      </div>

      {/* AI Twin Mentor Box */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
          <Bot size={18} />
          <span>AI TWIN PERSONAL MENTOR</span>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          "You chose MPC and want to become a Data Analyst. Your next step is to prepare for EAMCET, build Python & SQL skills in Year 1, and work on ML projects in Year 3."
        </p>
      </div>

      {/* Feature Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid var(--border-color)' }}>
        {[
          { key: 'advisor', label: '🤖 AI Career Advisor', toggleKey: 'edu_ai_advisor' },
          { key: 'roadmaps10th', label: '📚 After 10th Roadmaps', toggleKey: 'edu_roadmaps_10th' },
          { key: 'roadmapsInter', label: '🎓 After Intermediate', toggleKey: 'edu_roadmaps_inter' },
          { key: 'colleges', label: '🏛️ College Predictor', toggleKey: 'edu_college_predictor' },
          { key: 'exams', label: '📝 Entrance Exams', toggleKey: 'edu_entrance_guide' },
          { key: 'skills', label: '💼 Skill Roadmaps', toggleKey: 'edu_skill_roadmaps' },
          { key: 'scholarships', label: '🎯 Scholarships', toggleKey: 'edu_scholarships' },
          { key: 'docs', label: '📄 Document Checklist', toggleKey: 'edu_document_checklist' },
        ].map(tab => {
          const enabled = isFeatureEnabled(tab.toggleKey);
          return (
            <button
              key={tab.key}
              onClick={() => enabled && setActiveTab(tab.key as any)}
              className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-outline'}`}
              style={{
                fontSize: '0.82rem',
                padding: '8px 14px',
                whiteSpace: 'nowrap',
                opacity: enabled ? 1 : 0.4,
                cursor: enabled ? 'pointer' : 'not-allowed'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Career Advisor */}
      {activeTab === 'advisor' && (
        <div className={`card ${!isFeatureEnabled('edu_ai_advisor') ? 'card-disabled' : ''}`}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
            🤖 AI Career Advisor Questionnaire
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div className="input-group">
              <label className="input-label">What are your interests?</label>
              <input type="text" className="input-field" value={interests} onChange={(e) => setInterests(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Which subjects do you enjoy?</label>
              <input type="text" className="input-field" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">What are your strengths?</label>
              <input type="text" className="input-field" value={strengths} onChange={(e) => setStrengths(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="input-group">
              <label className="input-label">Budget Tier</label>
              <select className="select-field" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="Low">Low / Government College Focus</option>
                <option value="Medium">Medium / Standard</option>
                <option value="High">High / Private</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Job Target Preference</label>
              <select className="select-field" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="Private">Private Industry / Corporate</option>
                <option value="Government">Government / Public Sector</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleRunAdvisor} disabled={advisorLoading}>
            {advisorLoading ? 'Analyzing Stream & Career Match...' : 'Get Personalized Career Recommendation'}
          </button>

          {advisorResult && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>Recommended Match</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                Recommended Stream: {advisorResult.recommended_stream}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '8px 0' }}>
                {advisorResult.advice_summary}
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                Top Career Roles: {advisorResult.recommended_careers?.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: After 10th Roadmaps */}
      {activeTab === 'roadmaps10th' && (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(roadmaps10th).map(([key, val]: any) => (
            <div key={key} className="card">
              <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>{key} Stream</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val.full_name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '6px 0 12px 0' }}>{val.description}</p>
              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong>Career Pathways:</strong>
                {val.pathways?.map((p: string, pIdx: number) => (
                  <span key={pIdx} style={{ color: 'var(--text-primary)' }}>→ {p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: After Intermediate Roadmaps */}
      {activeTab === 'roadmapsInter' && (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(roadmapsInter).map(([domain, roles]: any) => (
            <div key={domain} className="card">
              <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>{domain} Domain</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Target Roles & Higher Studies</h4>
              {roles.map((r: string, rIdx: number) => (
                <div key={rIdx} style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '4px', marginBottom: '4px', fontSize: '0.84rem', fontWeight: 600 }}>
                  • {r}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: College Predictor */}
      {activeTab === 'colleges' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
            🏛️ College Predictor Engine
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div className="input-group">
              <label className="input-label">Entrance Rank</label>
              <input type="number" className="input-field" value={rank} onChange={(e) => setRank(Number(e.target.value))} />
            </div>
            <div className="input-group">
              <label className="input-label">Entrance Exam</label>
              <select className="select-field" value={exam} onChange={(e) => setExam(e.target.value)}>
                <option value="EAMCET">EAMCET</option>
                <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                <option value="NEET">NEET</option>
                <option value="CUET">CUET</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">State</label>
              <input type="text" className="input-field" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handlePredictColleges}>
            Predict Matched Colleges
          </button>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {collegeResults.map((col) => (
              <div key={col.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{col.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Branch: {col.branch} | Cutoff Rank: {col.cutoff_rank}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${col.admission_probability === 'High' ? 'badge-success' : 'badge-warning'}`}>
                    {col.admission_probability} Probability
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Placements: {col.avg_placement_lpa} LPA avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Skill Roadmaps */}
      {activeTab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {Object.entries(skillRoadmaps).map(([skill, levels]: any) => (
            <div key={skill} className="card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '12px' }}>
                💼 {skill} Roadmap
              </h4>

              <div style={{ marginBottom: '10px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent-success)' }}>Beginner:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{levels.beginner?.join(', ')}</p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent-warning)' }}>Intermediate:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{levels.intermediate?.join(', ')}</p>
              </div>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Advanced:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{levels.advanced?.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Scholarships */}
      {activeTab === 'scholarships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scholarshipsList.map((sch, idx) => (
            <div key={idx} className="card">
              <span className="badge badge-success" style={{ float: 'right' }}>Deadline: {sch.deadline}</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sch.name}</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '6px 0' }}>
                <strong>Eligibility:</strong> {sch.eligibility}
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                Aid Amount: {sch.amount}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 7: Document Checklist */}
      {activeTab === 'docs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {documentChecklist.map((docGroup, idx) => (
            <div key={idx} className="card">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                📄 {docGroup.category} Documents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {docGroup.items?.map((item: string, iIdx: number) => (
                  <label key={iIdx} style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
