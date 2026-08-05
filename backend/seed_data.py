from app.database import engine, Base, SessionLocal
import app.models # Register all models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Entrance Exams
    if db.query(app.models.EntranceExam).count() == 0:
        exams = [
            app.models.EntranceExam(
                name="EAMCET",
                eligibility="10+2 with MPC or BiPC stream (Minimum 45% aggregate).",
                syllabus="Physics, Chemistry, Mathematics (or Biology) based on Telangana / AP Board.",
                prep_tips="Solve past 10 years papers, practice time-bound mock tests, focus on speed.",
                important_dates="Application: March - April | Exam: May"
            ),
            app.models.EntranceExam(
                name="JEE Main & Advanced",
                eligibility="10+2 with Physics, Chemistry, Maths (Top 20 percentile or 75%+ marks).",
                syllabus="Class 11 & 12 Physics, Chemistry, Mathematics (NCERT & Advanced Problem Solving).",
                prep_tips="Master NCERT fundamentals, practice daily numerical problem sets, write full length mock tests.",
                important_dates="Session 1: Jan | Session 2: April | JEE Advanced: May"
            ),
            app.models.EntranceExam(
                name="NEET",
                eligibility="10+2 with Physics, Chemistry, Biology/Biotech (Minimum 50% aggregate).",
                syllabus="Class 11 & 12 Physics, Chemistry, Botany, Zoology.",
                prep_tips="NCERT Biology is crucial (80%+ questions directly linked). Focus on organic chemistry reactions.",
                important_dates="Application: Feb - March | Exam: May"
            ),
            app.models.EntranceExam(
                name="CUET",
                eligibility="Passed 12th Board Examinations from recognized board.",
                syllabus="General Test + Domain Specific Subjects (Maths, Commerce, Humanities, Science).",
                prep_tips="Focus on speed, general awareness, basic reasoning, and NCERT domain books.",
                important_dates="Application: Feb | Exam: May - June"
            ),
            app.models.EntranceExam(
                name="CLAT",
                eligibility="10+2 or equivalent with minimum 45% marks.",
                syllabus="English Language, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques.",
                prep_tips="Read daily national newspapers (The Hindu / Indian Express), practice legal passage comprehension.",
                important_dates="Exam: December"
            )
        ]
        db.add_all(exams)
        db.commit()

    # Seed Colleges
    if db.query(app.models.College).count() == 0:
        colleges = [
            app.models.College(
                name="JNTU College of Engineering, Hyderabad",
                state="Telangana",
                branch="Computer Science & Data Science",
                cutoff_rank=1200,
                exam="EAMCET",
                fees_per_year=35000.0,
                avg_placement_lpa=10.5,
                rating=4.7
            ),
            app.models.College(
                name="OU College of Engineering, Hyderabad",
                state="Telangana",
                branch="Artificial Intelligence & ML",
                cutoff_rank=1800,
                exam="EAMCET",
                fees_per_year=38000.0,
                avg_placement_lpa=9.8,
                rating=4.6
            ),
            app.models.College(
                name="CBR Institute of Technology (CBIT)",
                state="Telangana",
                branch="Information Technology",
                cutoff_rank=3200,
                exam="EAMCET",
                fees_per_year=140000.0,
                avg_placement_lpa=8.2,
                rating=4.5
            ),
            app.models.College(
                name="Vasavi College of Engineering",
                state="Telangana",
                branch="Computer Science Engineering",
                cutoff_rank=2800,
                exam="EAMCET",
                fees_per_year=135000.0,
                avg_placement_lpa=8.5,
                rating=4.4
            ),
            app.models.College(
                name="IIT Hyderabad",
                state="Telangana",
                branch="Computer Science Engineering",
                cutoff_rank=650,
                exam="JEE Main & Advanced",
                fees_per_year=220000.0,
                avg_placement_lpa=24.5,
                rating=4.9
            ),
            app.models.College(
                name="NIT Warangal",
                state="Telangana",
                branch="Data Science & Engineering",
                cutoff_rank=2100,
                exam="JEE Main & Advanced",
                fees_per_year=150000.0,
                avg_placement_lpa=18.0,
                rating=4.8
            )
        ]
        db.add_all(colleges)
        db.commit()

    db.close()
    print("[OK] Database tables created & seed data inserted successfully!")

if __name__ == "__main__":
    seed_database()
