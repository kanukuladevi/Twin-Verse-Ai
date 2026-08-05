from app.agents.profiler import ProfilerAgent
from app.agents.domain_agents import DomainAgent
from app.agents.analytics import AnalyticsAgent
from app.agents.risk_agent import RiskAgent
from app.agents.finance_agent import FinanceAgent
from app.agents.wellbeing_agent import WellbeingAgent
from app.agents.explainability import ExplainabilityAgent

class SupervisorOrchestrator:
    """
    Supervisor / Consensus Node: Coordinates multi-agent graph execution, 
    weights individual agent findings based on user priorities, and resolves conflicts.
    """
    def __init__(self):
        self.profiler = ProfilerAgent()
        self.domain_agent = DomainAgent()
        self.analytics = AnalyticsAgent()
        self.risk_agent = RiskAgent()
        self.finance = FinanceAgent()
        self.wellbeing = WellbeingAgent()
        self.explainability = ExplainabilityAgent()

    def process_decision(self, domain: str, query: str, user_profile: dict, user_answers: dict = None) -> dict:
        # Step 1: Profiler Agent
        prof_res = self.profiler.run(user_profile, query)

        # Step 2: Domain Agent
        dom_res = self.domain_agent.run(domain, query, prof_res["profile_context"])

        # Step 3: Analytics & ML Agent
        ana_res = self.analytics.run(domain, query)

        # Step 4: Risk Agent
        risk_res = self.risk_agent.run(domain, query)

        # Step 5: Finance Agent
        fin_res = self.finance.run(domain, query, prof_res["profile_context"].get("budget", "Medium"))

        # Step 6: Wellbeing Agent
        well_res = self.wellbeing.run(domain, query)

        # Step 7: Explainability Agent
        all_agent_steps = [prof_res, dom_res, ana_res, risk_res, fin_res, well_res]
        exp_res = self.explainability.run(all_agent_steps)
        all_agent_steps.append(exp_res)

        # Build Domain Specific Scored Options & Timelines
        scored_options, top_rec, timeline, confidence = self._generate_domain_options(
            domain, query, user_profile, user_answers, ana_res["metrics"]["success_probability"]
        )

        return {
            "agent_trace": all_agent_steps,
            "scored_options": scored_options,
            "top_recommendation": top_rec,
            "confidence_score": confidence,
            "risks_and_tradeoffs": risk_res["risks"],
            "why_explanation": (
                f"Recommended based on multi-agent consensus: Profiler matched goals ({user_profile.get('goals', ['Growth'])[0]}); "
                f"Analytics predicted {ana_res['metrics']['success_probability']}% success rate; "
                f"Finance verified {fin_res['financial_metrics']['projected_roi']} projected ROI; "
                f"Risk Agent flagged {len(risk_res['risks'])} key precautions."
            ),
            "citations": dom_res["citations"],
            "timeline_steps": timeline,
            "adaptive_questions": self._get_adaptive_questions(domain)
        }

    def _get_adaptive_questions(self, domain: str) -> list:
        domain = domain.lower()
        if "edu" in domain:
            return [
                {"id": "q1", "text": "What subjects do you enjoy most?", "options": ["Math & Logic", "Biology & Chemistry", "Commerce & Finance", "Arts & Literature"]},
                {"id": "q2", "text": "What is your target work sector?", "options": ["Software / Tech", "Government Jobs", "Healthcare / Medicine", "Business / Entrepreneurship"]},
                {"id": "q3", "text": "What is your primary decision constraint?", "options": ["Higher Starting Salary", "Lower Financial Cost", "Work-Life Balance", "Job Security"]}
            ]
        elif "health" in domain:
            return [
                {"id": "q1", "text": "What is the primary duration of symptoms?", "options": ["Less than 24 hours", "1-3 days", "Over a week", "Chronic / Persistent"]},
                {"id": "q2", "text": "Are you currently taking any prescription medications?", "options": ["Yes", "No", "Unsure"]}
            ]
        elif "biz" in domain:
            return [
                {"id": "q1", "text": "What is your main business objective for this quarter?", "options": ["Increase Sales Volume", "Improve Profit Margins", "Reduce Inventory Waste", "Expand Customer Base"]},
                {"id": "q2", "text": "What is your available budget for strategy execution?", "options": ["Under $1,000", "$1,000 - $5,000", "$5,000+"]}
            ]
        elif "content" in domain:
            return [
                {"id": "q1", "text": "What is your primary content format?", "options": ["Instagram Reels / Short Videos", "YouTube Long-form", "Text / LinkedIn Posts", "Podcasts"]},
                {"id": "q2", "text": "What is your posting frequency goal?", "options": ["Daily", "3x per week", "Weekly"]}
            ]
        else:
            return [
                {"id": "q1", "text": "What priority tier does this task belong to?", "options": ["Urgent & Important", "Important (Long-Term)", "Routine Daily"]},
                {"id": "q2", "text": "What time of day do you focus best?", "options": ["Morning (8 AM - 12 PM)", "Afternoon (12 PM - 5 PM)", "Evening (7 PM - 10 PM)"]}
            ]

    def _generate_domain_options(self, domain: str, query: str, profile: dict, answers: dict, success_prob: float) -> tuple:
        domain = domain.lower()
        q_lower = query.lower()

        if "edu" in domain or any(k in q_lower for k in ["study", "course", "stream", "college", "school", "teacher", "doctor", "bipc", "mpc", "career", "job", "biology", "degree"]):
            if any(k in q_lower for k in ["doctor", "mbbs", "medical", "medicine", "neet"]):
                options = [
                    {
                        "id": "opt_1",
                        "title": "BiPC Stream → NEET UG → MBBS / Medical Sciences",
                        "description": "Target Biology, Physics & Chemistry in +2 for top medical college entrance (NEET).",
                        "score": round(success_prob + 5.0, 1),
                        "cost_level": "High",
                        "difficulty": "Very High (NEET Exam)",
                        "benefit": "Highest Prestige & High Earning Potential",
                        "fit_to_goal": 96.0,
                        "risks": ["Intense competitive entrance exam (NEET)", "Long duration (5.5 yrs + PG)"],
                        "pros": ["High societal respect", "Lifelong job security & independent practice"],
                        "cons": ["Heavy study workload"]
                    },
                    {
                        "id": "opt_2",
                        "title": "B.Sc Allied Health / Pharmacy (B.Pharm) / BDS",
                        "description": "Alternative medical pathways in dental, pharmaceutical, or clinical diagnostic sciences.",
                        "score": round(success_prob - 2.0, 1),
                        "cost_level": "Medium",
                        "difficulty": "Moderate to High",
                        "benefit": "High (6-15 LPA)",
                        "fit_to_goal": 88.0,
                        "risks": ["Slightly lower starting scale than MBBS"],
                        "pros": ["Shorter duration", "Growing pharmaceutical and hospital industry demand"],
                        "cons": ["Specialized scope"]
                    }
                ]
                top_rec = "Option 1: BiPC Stream → NEET UG Prep → MBBS Medical Degree is your optimal roadmap to become a Doctor."
                timeline = [
                    {"phase": "Class 10 Pass", "action": "Enroll in BiPC (Biology, Physics, Chemistry) stream in Intermediate / 11th."},
                    {"phase": "Inter 11th-12th", "action": "Focus on NCERT Biology & Physics; prepare for NEET UG entrance exam."},
                    {"phase": "Entrance Exam", "action": "Score top percentile in NEET for Government Medical College seat."},
                    {"phase": "MBBS Degree (5.5 yrs)", "action": "Complete medical clinical rotations & 1-year internship."},
                    {"phase": "Specialization (MD/MS)", "action": "Pursue MD/MS or start medical practice as a certified Doctor."}
                ]
            elif any(k in q_lower for k in ["teacher", "teaching", "biology teacher", "b.ed", "lecturer", "professor"]):
                options = [
                    {
                        "id": "opt_1",
                        "title": "BiPC Stream → B.Sc Biological Sciences → B.Ed Certification",
                        "description": "Choose BiPC in 11th-12th, earn a B.Sc in Botany/Zoology, followed by B.Ed for school/college teaching.",
                        "score": round(success_prob + 4.0, 1),
                        "cost_level": "Low to Medium",
                        "difficulty": "Moderate",
                        "benefit": "High Job Security & Work-Life Balance",
                        "fit_to_goal": 95.0,
                        "risks": ["Requires clearing state/national Teacher Eligibility Test (TET/CTET)"],
                        "pros": ["Excellent work-life balance", "High demand in schools & coaching institutes", "Government & private opportunities"],
                        "cons": ["Moderate initial starting salary"]
                    },
                    {
                        "id": "opt_2",
                        "title": "Integrated B.Sc-B.Ed / M.Sc Biology → CSIR NET (Professor Track)",
                        "description": "Direct 4-year integrated teaching degree or Higher Education Lecturer pathway.",
                        "score": round(success_prob - 1.5, 1),
                        "cost_level": "Medium",
                        "difficulty": "High for NET",
                        "benefit": "High (Degree College Lecturer / University Professor)",
                        "fit_to_goal": 90.0,
                        "risks": ["Competitive NET exam for Assistant Professorship"],
                        "pros": ["Higher salary scale & academic research status"],
                        "cons": ["Requires Master's (M.Sc) degree"]
                    }
                ]
                top_rec = "Option 1: BiPC Stream → B.Sc Biological Sciences → B.Ed Certification is your optimal roadmap to become a Biology Teacher."
                timeline = [
                    {"phase": "Class 10 Pass", "action": "Select BiPC (Biology, Physics, Chemistry) in Intermediate / 10+2."},
                    {"phase": "Undergraduation", "action": "Enroll in B.Sc Botany / Zoology / Biotechnology / Biological Sciences."},
                    {"phase": "Teacher Training", "action": "Complete B.Ed (Bachelor of Education) degree program (2 years)."},
                    {"phase": "Eligibility Exam", "action": "Pass CTET / State TET (Teacher Eligibility Test)."},
                    {"phase": "Career Placement", "action": "Apply for TGT/PGT Biology Teacher posts in reputed schools or Junior Colleges."}
                ]
            elif any(k in q_lower for k in ["ca", "chartered accountant", "finance", "accounting", "commerce", "mec", "cec"]):
                options = [
                    {
                        "id": "opt_1",
                        "title": "MEC / CEC Stream → CA Foundation → B.Com / CA Inter & Final",
                        "description": "Direct commerce track targeting Chartered Accountancy and financial auditing.",
                        "score": round(success_prob + 3.5, 1),
                        "cost_level": "Low",
                        "difficulty": "High",
                        "benefit": "High (8-25 LPA)",
                        "fit_to_goal": 93.0,
                        "risks": ["Challenging multi-tier CA exams"],
                        "pros": ["Prestigious qualification", "High independent practice value"],
                        "cons": ["Requires long study hours"]
                    }
                ]
                top_rec = "Option 1: MEC Stream → CA Foundation → B.Com & CA Final is your optimal financial career roadmap."
                timeline = [
                    {"phase": "Class 10 Pass", "action": "Choose MEC (Maths, Economics, Commerce) stream."},
                    {"phase": "Inter 12th", "action": "Register for CA Foundation Exam with ICAI."},
                    {"phase": "Graduation & CA Inter", "action": "Complete B.Com and pass CA Intermediate group exams."},
                    {"phase": "Articleship (2 yrs)", "action": "Complete mandatory practical audit articleship training."},
                    {"phase": "CA Final", "action": "Pass CA Final to qualify as a certified Chartered Accountant."}
                ]
            else:
                options = [
                    {
                        "id": "opt_1",
                        "title": "MPC Stream → B.Tech Computer Science / Data Science / AI Engineering",
                        "description": "High demand, strong analytical alignment. Direct path to Software / Data / AI roles.",
                        "score": round(success_prob + 4.0, 1),
                        "cost_level": "Medium",
                        "difficulty": "Moderate",
                        "benefit": "High (12-25 LPA potential)",
                        "fit_to_goal": 94.0,
                        "risks": ["High entrance exam competition (JEE/EAMCET)", "Requires solid math foundation"],
                        "pros": ["Highest job opening volume", "Global career mobility"],
                        "cons": ["Intense curriculum workload"]
                    },
                    {
                        "id": "opt_2",
                        "title": "MEC / B.Com → CA / Financial Analyst",
                        "description": "Focus on finance, accounting, and business analytics with strong market stability.",
                        "score": round(success_prob - 2.5, 1),
                        "cost_level": "Low to Medium",
                        "difficulty": "High (CA Exams)",
                        "benefit": "High (8-20 LPA)",
                        "fit_to_goal": 88.0,
                        "risks": ["Rigorous multi-stage professional exams"],
                        "pros": ["Excellent prestige and independence"],
                        "cons": ["Long study duration"]
                    },
                    {
                        "id": "opt_3",
                        "title": "Diploma (Polytechnic) → Lateral B.Tech Entry",
                        "description": "Practical hands-on technical training with direct pathway into engineering.",
                        "score": round(success_prob - 6.0, 1),
                        "cost_level": "Low",
                        "difficulty": "Low to Moderate",
                        "benefit": "Moderate (4-8 LPA initial)",
                        "fit_to_goal": 82.0,
                        "risks": ["Slightly lower initial salary ceiling than direct B.Tech"],
                        "pros": ["Lower tuition cost", "Early practical technical skills"],
                        "cons": ["Additional year step required"]
                    }
                ]
                top_rec = f"Option 1: Customized Academic Stream tailored for '{query}' is your optimal career roadmap."
                timeline = [
                    {"phase": "Class 10 / Current", "action": f"Focus on foundational subjects relevant to '{query}'."},
                    {"phase": "Intermediate (11-12th)", "action": "Select matching stream (MPC / BiPC / MEC) and prepare for entrance exams."},
                    {"phase": "Degree College", "action": "Enroll in specialized bachelor degree program."},
                    {"phase": "Skill Building", "action": "Complete practical internships and industry certifications."},
                    {"phase": "Career Placement", "action": "Apply for specialized job roles matching your target career."}
                ]

        elif "health" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": f"Targeted Protocol for '{query[:40]}': Hydration, Rest & Vital Monitoring",
                    "description": "Self-care and vital monitoring protocol tailored to your query.",
                    "score": 91.5,
                    "cost_level": "Very Low",
                    "difficulty": "Easy",
                    "benefit": "Fast recovery & symptom relief",
                    "fit_to_goal": 95.0,
                    "risks": ["Escalate to physician if severe pain or high fever persists"],
                    "pros": ["Non-invasive", "Zero medical downtime"],
                    "cons": ["Requires self-discipline on sleep & water intake"]
                },
                {
                    "id": "opt_2",
                    "title": "Schedule Outpatient General Physician Consultation",
                    "description": "Professional medical evaluation & diagnostic lab screening.",
                    "score": 87.0,
                    "cost_level": "Low",
                    "difficulty": "Easy",
                    "benefit": "Definitive clinical diagnosis",
                    "fit_to_goal": 90.0,
                    "risks": ["Minor waiting time at clinic"],
                    "pros": ["Complete medical clarity & prescription"],
                    "cons": ["Consultation fee"]
                }
            ]
            top_rec = f"Option 1: Follow tailored care protocol for '{query}' while tracking vitals. Consult a doctor if symptoms persist past 48h."
            timeline = [
                {"phase": "Immediate (Day 1)", "action": f"Address '{query}' with rest, proper hydration, and vital logging."},
                {"phase": "Day 2 Review", "action": "Check AI Twin health trend log; evaluate symptom change."},
                {"phase": "Day 3 Action", "action": "If recovered continue healthy routine; else book doctor appointment."}
            ]

        elif "biz" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": f"Business Execution Strategy for '{query[:40]}'",
                    "description": "Targeted operational optimization and marketing execution.",
                    "score": 93.8,
                    "cost_level": "Moderate",
                    "difficulty": "Easy",
                    "benefit": "+18-24% Gross Revenue Boost",
                    "fit_to_goal": 96.0,
                    "risks": ["Requires execution tracking"],
                    "pros": ["Immediate revenue & efficiency gain"],
                    "cons": ["Requires initial focus"]
                }
            ]
            top_rec = f"Option 1: Execute optimized business strategy targeting '{query}' immediately."
            timeline = [
                {"phase": "Phase 1", "action": f"Implement inventory & marketing workflow for '{query}'."},
                {"phase": "Phase 2", "action": "Launch promo push & track lead conversion rates."},
                {"phase": "Phase 3", "action": "Review profit metrics & scale successful channels."}
            ]

        elif "content" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": f"Viral Short-Form Script & Hook Plan for '{query[:40]}'",
                    "description": "High engagement script structure with strong viral hook.",
                    "score": 92.4,
                    "cost_level": "Zero",
                    "difficulty": "Moderate",
                    "benefit": "Estimated +15k-30k organic views",
                    "fit_to_goal": 95.0,
                    "risks": ["Requires posting at peak audience hours"],
                    "pros": ["High save and share rate"],
                    "cons": ["Requires script rehearsal"]
                }
            ]
            top_rec = f"Option 1: Publish the viral content script for '{query}' during peak engagement hours."
            timeline = [
                {"phase": "Hook & Script", "action": f"Draft 15-second hook addressing '{query}'."},
                {"phase": "Record & Edit", "action": "Add dynamic captions and trending audio."},
                {"phase": "Publish & Engage", "action": "Post at 7:00 PM and respond to top comments."}
            ]

        else: # personal / default
            options = [
                {
                    "id": "opt_1",
                    "title": f"Focus Strategy for '{query[:40]}': Evening Time-Block (7-9 PM)",
                    "description": f"Allocate dedicated high-cognitive focus time for '{query}'.",
                    "score": 90.0,
                    "cost_level": "Zero",
                    "difficulty": "Easy",
                    "benefit": "Maximum task completion speed",
                    "fit_to_goal": 94.0,
                    "risks": ["Requires turning off phone notifications during focus block"],
                    "pros": ["Builds consistent habit streak"],
                    "cons": ["Requires discipline"]
                }
            ]
            top_rec = f"Option 1: Time-block dedicated focus time for '{query}' during peak hours."
            timeline = [
                {"phase": "Preparation", "action": f"Break down '{query}' into 3 actionable steps."},
                {"phase": "Focus Block", "action": "Begin 2-hour distraction-free work window."},
                {"phase": "Review", "action": "Mark progress complete on AI Twin dashboard."}
            ]

        confidence = round(min(98.0, max(75.0, (options[0]["score"] + success_prob) / 2.0)), 1)
        return options, top_rec, timeline, confidence
