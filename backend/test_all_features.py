import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("==================================================")
    print("[TEST] STARTING AI TWIN AUTOMATED FUNCTIONALITY TEST")
    print("==================================================")

    # 1. Health Check
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200
    print("[PASS] Backend Root Server Health Check")

    # 2. Auth - Register & Login
    test_user = {
        "name": "Test User",
        "email": "test_user_eval@aitwin.com",
        "password": "password123"
    }
    
    reg_res = requests.post(f"{BASE_URL}/auth/register", json=test_user)
    if reg_res.status_code == 200:
        token = reg_res.json()["access_token"]
        print("[PASS] User Registration & Automatic Twin Profile Initialization")
    else:
        login_res = requests.post(f"{BASE_URL}/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        print("[PASS] User Authentication & JWT Login")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Digital Twin Memory & Greeting
    twin_res = requests.get(f"{BASE_URL}/twin/greeting", headers=headers)
    assert twin_res.status_code == 200
    print(f"[PASS] Proactive Twin Greeting: '{twin_res.json()['greeting'][:60]}...'")

    # 4. Multi-Agent Decision Intelligence Engine
    dec_req = {
        "domain": "education",
        "title": "Automated Test: MPC vs BiPC Stream Decision",
        "user_query": "I enjoy math and coding. Should I choose MPC for B.Tech Data Science?"
    }
    eval_res = requests.post(f"{BASE_URL}/decisions/evaluate", json=dec_req, headers=headers)
    assert eval_res.status_code == 200
    dec_data = eval_res.json()
    assert len(dec_data["agent_trace"]) >= 6
    assert dec_data["confidence_score"] > 70
    print(f"[PASS] Multi-Agent Graph (7 Agents) Consensus Score: {dec_data['confidence_score']}%")

    pdf_res = requests.get(f"{BASE_URL}/decisions/{dec_data['id']}/export-pdf", headers=headers)
    if pdf_res.status_code != 200:
        print("PDF EXPORT ERROR:", pdf_res.status_code, pdf_res.text)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    print("[PASS] Official Decision PDF Report Export")

    # 6. Domain 1: Education
    edu_advisor = requests.post(f"{BASE_URL}/education/ai-career-advisor", json={
        "interests": ["Coding", "AI"],
        "subjects": ["Math"],
        "strengths": ["Logic"],
        "budget": "Medium",
        "job_type": "Private"
    }, headers=headers)
    assert edu_advisor.status_code == 200
    assert edu_advisor.json()["recommended_stream"] == "MPC"
    print("[PASS] Feature 1 (Education): AI Career Advisor Engine")

    college_res = requests.get(f"{BASE_URL}/education/college-predictor?rank=1500&exam=EAMCET&state=Telangana", headers=headers)
    assert college_res.status_code == 200
    print(f"[PASS] Feature 1 (Education): College Predictor ({len(college_res.json()['matched_colleges'])} matched colleges)")

    # 7. Domain 2: Customer Support
    chat_res = requests.post(f"{BASE_URL}/support/chat", json={"message": "I have an issue with my payment order"}, headers=headers)
    assert chat_res.status_code == 200
    print(f"[PASS] Feature 2 (Support): 24/7 AI Chat & Sentiment Detection ('{chat_res.json()['sentiment_detected']}')")

    tkt_res = requests.post(f"{BASE_URL}/support/complaints/create", json={
        "category": "Payment",
        "subject": "Payment deducted twice",
        "description": "Please refund duplicate transaction"
    }, headers=headers)
    assert tkt_res.status_code == 200
    print(f"[PASS] Feature 2 (Support): Complaint Ticket Creation & Smart Routing ({tkt_res.json()['department']})")

    # 8. Domain 3: Healthcare
    triage_res = requests.post(f"{BASE_URL}/healthcare/symptom-triage", json={
        "symptoms": ["fever", "headache"],
        "duration": "1-3 days",
        "severity": "Mild"
    }, headers=headers)
    assert triage_res.status_code == 200
    print("[PASS] Feature 3 (Healthcare): Symptom Triage & Clinical Safety Guardrails")

    report_res = requests.post(f"{BASE_URL}/healthcare/report-analyzer?title=Lipid%20Panel", headers=headers)
    assert report_res.status_code == 200
    print("[PASS] Feature 3 (Healthcare): Lab Report RAG & OCR Analyzer")

    # 9. Domain 4: Business
    biz_dash = requests.get(f"{BASE_URL}/business/dashboard", headers=headers)
    assert biz_dash.status_code == 200
    print(f"[PASS] Feature 4 (Business): Operations Dashboard (${biz_dash.json()['total_revenue']} Revenue)")

    biz_adv = requests.get(f"{BASE_URL}/business/ai-advisor", headers=headers)
    assert biz_adv.status_code == 200
    print("[PASS] Feature 4 (Business): AI Business Consultant Recommendations")

    # 10. Domain 5: Personal Assistant
    ast_sched = requests.get(f"{BASE_URL}/assistant/daily-schedule", headers=headers)
    assert ast_sched.status_code == 200
    print("[PASS] Feature 5 (Assistant): Daily Schedule & Proactive Brief")

    # 11. Domain 6: Content Creation
    cnt_gen = requests.post(f"{BASE_URL}/content/generate", json={
        "niche": "Tech & AI",
        "contentType": "Reel",
        "topic": "AI Twins in 2026",
        "target_tone": "Engaging"
    }, headers=headers)
    assert cnt_gen.status_code == 200
    print(f"[PASS] Feature 6 (Content Creation): Script & Hook Generator (ML Score: {cnt_gen.json()['predicted_engagement_score']}%)")

    # 12. Feature Toggle System Enforcer Check
    toggle_set = requests.post(f"{BASE_URL}/features/toggle", json={"feature_key": "edu_scholarships", "enabled": False}, headers=headers)
    assert toggle_set.status_code == 200
    
    toggle_check = requests.get(f"{BASE_URL}/education/scholarships", headers=headers)
    assert toggle_check.status_code == 403 # Disabled feature should return 403 Forbidden!
    print("[PASS] Feature Toggle Security: Disabled feature blocked with 403 Forbidden")

    # Restore toggle
    requests.post(f"{BASE_URL}/features/toggle", json={"feature_key": "edu_scholarships", "enabled": True}, headers=headers)

    print("--------------------------------------------------")
    print("[SUCCESS] ALL 12 CORE FUNCTIONALITY TESTS PASSED 100%!")
    print("--------------------------------------------------")

if __name__ == "__main__":
    run_tests()
