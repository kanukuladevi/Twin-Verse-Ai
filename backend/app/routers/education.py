from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.domain_models import College, EntranceExam
from app.schemas.domain_schemas import CareerAdvisorRequest, CollegePredictorQuery

router = APIRouter(prefix="/education", tags=["Feature 1: Education"])

# Static Domain Data Knowledge Repositories
AFTER_10TH_ROADMAPS = {
    "MPC": {
        "full_name": "Maths, Physics, Chemistry",
        "description": "Ideal for students seeking analytical, engineering, and technology careers.",
        "pathways": ["Engineering (B.Tech / B.E)", "Architecture (B.Arch)", "Defence (NDA)", "Data Science & AI"]
    },
    "BiPC": {
        "full_name": "Biology, Physics, Chemistry",
        "description": "Ideal for medical, life sciences, healthcare, and biotech careers.",
        "pathways": ["MBBS / BDS", "Pharmacy (B.Pharm / Pharm.D)", "Nursing & Allied Health", "Biotechnology & Genetics"]
    },
    "MEC": {
        "full_name": "Maths, Economics, Commerce",
        "description": "Ideal for financial analysis, corporate accounting, management, and banking.",
        "pathways": ["B.Com (Honours / Analytics)", "Chartered Accountancy (CA)", "CMA / CS", "Banking & Finance"]
    },
    "CEC": {
        "full_name": "Civics, Economics, Commerce",
        "description": "Ideal for business management, administrative services, journalism, and law.",
        "pathways": ["Law (Integrated B.A. LL.B)", "UPSC & Civil Services", "Business Administration (BBA)", "Journalism & Media"]
    },
    "HEC": {
        "full_name": "History, Economics, Civics",
        "description": "Ideal for humanities, public service, policy, social research, and teaching.",
        "pathways": ["Humanities & Social Sciences", "Civil Services Preparation", "Teaching & Academia", "Public Policy"]
    },
    "Diploma": {
        "full_name": "Polytechnic Diploma (3 Years)",
        "description": "Practical hands-on technical education with direct lateral entry into 2nd year B.Tech.",
        "pathways": ["Polytechnic Diploma", "Lateral Entry B.Tech Engineering", "Industrial Technician Roles"]
    },
    "ITI": {
        "full_name": "Industrial Training Institute (1-2 Years)",
        "description": "Vocational technical skill training for early employment and trade roles.",
        "pathways": ["Technical Jobs", "Apprenticeships (Railways, PSU)", "Government Technical Posts"]
    }
}

AFTER_INTERMEDIATE_ROADMAPS = {
    "Engineering": ["Software Engineer", "AI/ML Engineer", "Data Analyst", "Cybersecurity Specialist", "Cloud Engineer"],
    "Degree": ["MBA", "Government Jobs (SSC, Banking, UPSC)", "Higher Studies (M.Sc / MA / MS)"],
    "Medical": ["Doctor (MBBS)", "PG Specialization (MD/MS)", "Clinical Research", "Hospital Administration"],
    "Commerce": ["Chartered Accountant (CA)", "CMA", "Company Secretary (CS)", "Investment Banking"],
    "Arts": ["Civil Services (IAS/IPS)", "Law Practitioner", "Journalism & Mass Media", "Professor / Teacher"]
}

SKILL_ROADMAPS = {
    "Data Analyst": {
        "beginner": ["Excel & Advanced Formulas", "SQL Queries & Database Design", "Basic Statistics"],
        "intermediate": ["Python (Pandas, NumPy)", "Power BI / Tableau Dashboarding", "Data Cleaning"],
        "advanced": ["Machine Learning Basics (Scikit-Learn)", "Big Data (PySpark)", "Business Storytelling"]
    },
    "AI/ML Engineer": {
        "beginner": ["Python Programming", "Linear Algebra & Calculus", "Data Structures"],
        "intermediate": ["Scikit-learn", "Deep Learning (PyTorch / TensorFlow)", "Model Training"],
        "advanced": ["LLM Architecture & Fine-tuning", "LangChain & Vector Databases", "MLOps Deployment"]
    },
    "Software Developer": {
        "beginner": ["HTML, CSS & JavaScript", "Python or Java Fundamentals", "Git Version Control"],
        "intermediate": ["React.js Framework", "Node.js / FastAPI Backend APIs", "Database Design"],
        "advanced": ["System Design & Microservices", "CI/CD & Docker", "Cloud Services (AWS/GCP)"]
    },
    "UI/UX Designer": {
        "beginner": ["Design Thinking Principles", "Figma Fundamentals", "Wireframing"],
        "intermediate": ["Interactive Prototyping", "User Research & Testing", "Design Systems"],
        "advanced": ["Micro-interactions & Animations", "Usability Audit", "Product Strategy"]
    },
    "Digital Marketer": {
        "beginner": ["SEO Fundamentals", "Social Media Marketing", "Content Writing"],
        "intermediate": ["Google Analytics 4", "Meta & Google Paid Ads", "Email Marketing Automation"],
        "advanced": ["Conversion Rate Optimization", "Growth Hacking", "Marketing Attribution"]
    },
    "Chartered Accountant": {
        "beginner": ["CA Foundation Accounting", "Business Laws", "Quantitative Aptitude"],
        "intermediate": ["CA Intermediate Group 1 & 2", "Articleship Training", "Taxation & Audit"],
        "advanced": ["CA Final Exams", "Corporate Law Specialization", "Strategic Financial Management"]
    }
}

SCHOLARSHIPS_DATA = [
    {
        "name": "State Post-Matric Merit Scholarship",
        "eligibility": "Income < 2.5 LPA, Category: SC/ST/OBC/EBC, State resident.",
        "amount": "100% Tuition Fee Reimbursement + Monthly Maintenance Allowance.",
        "deadline": "October 31, 2026"
    },
    {
        "name": "National Means-cum-Merit Scholarship (NMMSS)",
        "eligibility": "Minimum 55% marks in Class 8th/10th, Family Income < 3.5 LPA.",
        "amount": "Rs 12,000 per annum.",
        "deadline": "November 15, 2026"
    },
    {
        "name": "Central Sector Scheme of Scholarships for College Students",
        "eligibility": "Top 20th percentile in Class 12th board exams.",
        "amount": "Rs 12,000 to Rs 20,000 per year during graduation.",
        "deadline": "December 10, 2026"
    }
]

DOCUMENT_CHECKLIST = [
    {"category": "Admissions", "items": ["10th Marks Memo (SSC)", "12th / Intermediate Memo", "Transfer Certificate (TC)", "Study & Conduct Certificates (Class 6-12)", "Entrance Exam Rank Card"]},
    {"category": "Scholarships", "items": ["Income Certificate (Issued by Meeseva / Tehsildar)", "Caste Certificate", "Aadhaar Card linked to Bank Account", "Ration Card / Income Proof", "Passport Size Photos"]},
    {"category": "Internships & Placements", "items": ["Updated Professional Resume", "College Bonafide Certificate", "GitHub / Portfolio Project Links", "NOC (No Objection Certificate) from College"]}
]

@router.get("/roadmaps-10th")
def get_roadmaps_10th(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_roadmaps_10th", current_user.id, db)
    return AFTER_10TH_ROADMAPS

@router.get("/roadmaps-inter")
def get_roadmaps_inter(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_roadmaps_inter", current_user.id, db)
    return AFTER_INTERMEDIATE_ROADMAPS

@router.post("/ai-career-advisor")
def ai_career_advisor(req: CareerAdvisorRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_ai_advisor", current_user.id, db)

    # Heuristic recommendation engine
    fav_subjects = [s.lower() for s in req.subjects]
    
    if any(s in fav_subjects for s in ["math", "mathematics", "physics", "computer", "coding"]):
        stream = "MPC"
        recommended_careers = ["Data Science & AI Engineer", "Software Engineer", "Cybersecurity Specialist"]
        exam = "EAMCET / JEE Main"
    elif any(s in fav_subjects for s in ["biology", "botany", "zoology", "chemistry"]):
        stream = "BiPC"
        recommended_careers = ["Doctor (MBBS)", "Pharmacy (B.Pharm)", "Biotechnology Researcher"]
        exam = "NEET"
    elif any(s in fav_subjects for s in ["commerce", "economics", "accounts", "finance"]):
        stream = "MEC"
        recommended_careers = ["Chartered Accountant (CA)", "Financial Analyst", "Commercial Banker"]
        exam = "CA Foundation / CUET"
    else:
        stream = "CEC / HEC"
        recommended_careers = ["Civil Services (IAS/IPS)", "Corporate Lawyer", "Journalist / Content Strategist"]
        exam = "CLAT / CUET"

    advice = (
        f"Based on your interest in {', '.join(req.interests)} and strength in {', '.join(req.strengths)}, "
        f"the AI Twin recommends opting for the {stream} stream. "
        f"Top matching careers for a {req.job_type} job target: {', '.join(recommended_careers)}. "
        f"Key entrance focus: {exam}."
    )

    return {
        "recommended_stream": stream,
        "recommended_careers": recommended_careers,
        "recommended_exam": exam,
        "advice_summary": advice
    }

@router.get("/college-predictor")
def predict_colleges(
    rank: int = Query(...),
    exam: str = Query(...),
    state: str = Query("Telangana"),
    branch: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_feature_enabled("edu_college_predictor", current_user.id, db)

    query = db.query(College).filter(College.exam == exam, College.state == state)
    if branch:
        query = query.filter(College.branch.ilike(f"%{branch}%"))
    
    all_colleges = query.all()
    
    # Filter colleges where rank <= cutoff_rank + 5000 margin
    eligible = [
        {
            "id": c.id,
            "name": c.name,
            "state": c.state,
            "branch": c.branch,
            "cutoff_rank": c.cutoff_rank,
            "fees_per_year": c.fees_per_year,
            "avg_placement_lpa": c.avg_placement_lpa,
            "rating": c.rating,
            "admission_probability": "High" if rank <= c.cutoff_rank else ("Medium" if rank <= c.cutoff_rank + 3000 else "Low")
        }
        for c in all_colleges if rank <= (c.cutoff_rank + 5000)
    ]
    
    return {
        "user_rank": rank,
        "exam": exam,
        "matched_colleges": sorted(eligible, key=lambda x: x["cutoff_rank"])
    }

@router.get("/entrance-exams")
def get_entrance_exams(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_entrance_guide", current_user.id, db)
    return db.query(EntranceExam).all()

@router.get("/skill-roadmaps")
def get_skill_roadmaps(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_skill_roadmaps", current_user.id, db)
    return SKILL_ROADMAPS

@router.get("/scholarships")
def get_scholarships(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_scholarships", current_user.id, db)
    return SCHOLARSHIPS_DATA

@router.get("/document-checklist")
def get_document_checklist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("edu_document_checklist", current_user.id, db)
    return DOCUMENT_CHECKLIST
