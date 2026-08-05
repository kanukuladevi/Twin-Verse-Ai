# Twin-Verse AI 🚀
### Agentic Decision Intelligence Platform featuring Multi-Agent AI & Personal Twin Memory

Twin-Verse AI is a decision intelligence web application built with FastAPI, React (TypeScript + Vite), and Multi-Agent AI architecture. It combines a personal Digital Twin memory system with 6 specialized domain modules and a 7-agent consensus engine to analyze complex decisions.

---

## 🌟 Key Features

- 🧠 **Multi-Agent Consensus Engine**: 7 specialized AI agents evaluate complex user queries, debate options, generate confidence scores, and produce downloadable PDF decision reports.
- 👤 **Digital Twin Memory System**: Context-aware personal memory that learns preferences, goals, and history for proactive daily briefings.
- 🎓 **Education & Career Advisor**: Stream selection (MPC/BiPC), college rank predictor (EAMCET/JEE), and scholarship discovery.
- 💬 **24/7 AI Customer Support**: Live chat with automated sentiment analysis, complaint ticket creation, and department routing.
- 🏥 **Healthcare Triage**: Symptom triage with safety guardrails and lab report RAG/OCR analysis.
- 📊 **Business Intelligence Dashboard**: Operations metrics, KPI analytics, and AI business recommendations.
- 📅 **Personal Assistant**: Daily schedule planner, habit tracking, and task prioritization.
- 🎬 **Content Creation Suite**: Social media script generator, viral hook creation, and ML engagement score prediction.
- 🔐 **Feature Toggle Control**: Dynamic admin toggles for enabling/disabling domain features on the fly.

---

## 📁 Repository Structure

```
Twin-Verse-Ai/
├── backend/                # FastAPI Python Backend
│   ├── app/
│   │   ├── agents/         # Multi-Agent consensus logic
│   │   ├── models/         # SQLAlchemy DB Models
│   │   ├── routers/        # API Endpoints across 6 domain modules
│   │   └── main.py         # App entrypoint & CORS config
│   ├── requirements.txt    # Python dependencies
│   └── test_all_features.py# Automated E2E test suite
└── frontend/               # React (TypeScript + Vite) App
    ├── src/
    │   ├── components/     # UI Components
    │   ├── pages/          # Domain Views (Education, Healthcare, Business, etc.)
    │   └── App.tsx         # Main router and layout
    └── package.json        # Frontend dependencies
```

---

## 🛠️ Setup & Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and set your API keys.
5. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

Run the comprehensive end-to-end backend verification test suite:
```bash
cd backend
python test_all_features.py
```
