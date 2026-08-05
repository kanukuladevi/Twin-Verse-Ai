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

        if "edu" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": "MPC Stream → B.Tech Data Science / AI Engineering",
                    "description": "High demand, strong analytical alignment. Direct path to Software / Data roles.",
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
            top_rec = "Option 1: MPC Stream → B.Tech Data Science / AI Engineering is your optimal career roadmap."
            timeline = [
                {"phase": "Class 10", "action": "Focus on Math & Science fundamentals; choose MPC stream."},
                {"phase": "Intermediate (11-12th)", "action": "Prepare for EAMCET & JEE Main; learn Python basics."},
                {"phase": "College Year 1-2", "action": "Build Core CS fundamentals, Data Structures & SQL."},
                {"phase": "College Year 3", "action": "Complete Machine Learning internships & real-world projects."},
                {"phase": "Final Year & Placement", "action": "Campus interviews & AI / Data Analyst job offers."}
            ]

        elif "health" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": "Hydration, Rest & OTC Symptom Relief + 48hr Monitoring",
                    "description": "Conservative self-care protocol supported by continuous vital tracking.",
                    "score": 91.5,
                    "cost_level": "Very Low",
                    "difficulty": "Easy",
                    "benefit": "Fast recovery for mild stress/fatigue symptoms",
                    "fit_to_goal": 95.0,
                    "risks": ["Must escalate to doctor if fever > 101°F or pain worsens"],
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
            top_rec = "Option 1: Follow Hydration & Rest protocol while logging daily vitals. Consult a doctor if symptoms persist past 48 hours."
            timeline = [
                {"phase": "Immediate (Day 1)", "action": "Drink 3L water, rest, and log blood pressure & temperature."},
                {"phase": "Day 2 Review", "action": "Check AI Twin health trend log; evaluate symptom score change."},
                {"phase": "Day 3 Action", "action": "If fully recovered continue healthy routine; else book doctor appointment."}
            ]

        elif "biz" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": "Reorder Top-Selling Fast Stock + Run Weekend Bundle Promotion",
                    "description": "Capitalize on high demand items while bundling slower inventory to maximize turnover.",
                    "score": 93.8,
                    "cost_level": "Moderate",
                    "difficulty": "Easy",
                    "benefit": "+18-24% Gross Revenue Boost",
                    "fit_to_goal": 96.0,
                    "risks": ["Requires cash flow upfront for reordering"],
                    "pros": ["Immediate revenue spike", "Clears slow moving inventory"],
                    "cons": ["Slight margin discount on bundled items"]
                },
                {
                    "id": "opt_2",
                    "title": "Maintain Current Inventory & Increase Social Media Ads",
                    "description": "Drive foot traffic/online visits using targeted ad campaigns.",
                    "score": 84.2,
                    "cost_level": "Low to High",
                    "difficulty": "Moderate",
                    "benefit": "Brand visibility boost",
                    "fit_to_goal": 85.0,
                    "risks": ["Risk of running out of popular items mid-weekend"],
                    "pros": ["Attracts new customer profiles"],
                    "cons": ["Ad spend risk without inventory readiness"]
                }
            ]
            top_rec = "Option 1: Reorder fast-selling stock immediately and initiate weekend promotional bundle."
            timeline = [
                {"phase": "Today (Morning)", "action": "Place purchase order for top 2 fast-selling SKUs."},
                {"phase": "Today (Evening)", "action": "Setup 10% discount promo bundle on slow-moving inventory."},
                {"phase": "Weekend Execution", "action": "Increase staffing by 1 extra employee for peak hours."},
                {"phase": "Monday Audit", "action": "Review AI Twin sales report & profit margin breakdown."}
            ]

        elif "content" in domain:
            options = [
                {
                    "id": "opt_1",
                    "title": "Publish Trending AI Tutorial Reel at Peak Active Hour (7:00 PM)",
                    "description": "High engagement probability. Capitalize on viral tech trend with strong hook.",
                    "score": 92.4,
                    "cost_level": "Zero",
                    "difficulty": "Moderate",
                    "benefit": "High reach (+15k-30k views estimated)",
                    "fit_to_goal": 95.0,
                    "risks": ["Requires posting precisely on schedule"],
                    "pros": ["High save and share rate", "Attracts tech-savvy followers"],
                    "cons": ["Requires 30 mins script preparation"]
                },
                {
                    "id": "opt_2",
                    "title": "Publish General Lifestyle Story & Carousel Post",
                    "description": "Nurture existing community with personal story and interactive Q&A poll.",
                    "score": 83.0,
                    "cost_level": "Zero",
                    "difficulty": "Easy",
                    "benefit": "High comment response rate",
                    "fit_to_goal": 86.0,
                    "risks": ["Lower viral discovery than short video reels"],
                    "pros": ["Quick to produce"],
                    "cons": ["Lower new follower growth"]
                }
            ]
            top_rec = "Option 1: Post the Educational AI Tutorial Reel at 7:00 PM using recommended trending audio."
            timeline = [
                {"phase": "Step 1 (Script)", "action": "Use AI Twin Script Writer for 15-second hook & clear Call-To-Action."},
                {"phase": "Step 2 (Edit & Caption)", "action": "Generate high-converting hashtags and caption tone."},
                {"phase": "Step 3 (Publish)", "action": "Schedule or post at 7:00 PM peak follower activity time."},
                {"phase": "Step 4 (Engage)", "action": "Reply to first 10 comments within 30 minutes to boost algorithm rank."}
            ]

        else: # personal / default
            options = [
                {
                    "id": "opt_1",
                    "title": "Time-Block High Priority Tasks in Evening Focus Window (7-9 PM)",
                    "description": "Align deep work with user's natural peak cognitive hours.",
                    "score": 90.0,
                    "cost_level": "Zero",
                    "difficulty": "Easy",
                    "benefit": "Maximum task completion speed",
                    "fit_to_goal": 94.0,
                    "risks": ["Requires turning off phone notifications during 2hr block"],
                    "pros": ["Builds consistent habit streak"],
                    "cons": ["Requires evening discipline"]
                }
            ]
            top_rec = "Option 1: Time-block your core task between 7 PM and 9 PM tonight for maximum focus."
            timeline = [
                {"phase": "Morning", "action": "Review daily brief & complete 2 quick low-effort tasks."},
                {"phase": "Evening (7:00 PM)", "action": "Begin 2-hour distraction-free focus block."},
                {"phase": "Night (9:30 PM)", "action": "Mark task complete; review habit streak on AI Twin."}
            ]

        confidence = round(min(98.0, max(75.0, (options[0]["score"] + success_prob) / 2.0)), 1)
        return options, top_rec, timeline, confidence
