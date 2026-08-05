class RiskAgent:
    """
    Risk Agent: Identifies potential risks, trade-offs, downside scenarios, competition pressure, 
    and compliance safety limits for each option.
    """
    def run(self, domain: str, query: str) -> dict:
        domain = domain.lower()
        
        if "edu" in domain:
            risks = [
                "High entrance competition in top tier branches.",
                "Requires consistent daily 3-4 hour study effort over 1-2 years.",
                "Technological shifts require continuous upskilling beyond college curriculum."
            ]
        elif "health" in domain:
            risks = [
                "Discontinuing medication without doctor consultation can cause rebound symptoms.",
                "Self-care measures must be discontinued immediately if high fever or severe pain develops.",
                "Disclaimer: AI guidance is non-diagnostic."
            ]
        elif "biz" in domain:
            risks = [
                "Inventory stock-out risk during upcoming weekend demand surge.",
                "Supplier lead times may delay restocking by 2-3 business days.",
                "Seasonal fluctuations may impact gross margin by 5-8%."
            ]
        elif "content" in domain:
            risks = [
                "Posting inconsistent content formats may reduce algorithmic distribution.",
                "Audience fatigue if posting topics without visual variety."
            ]
        else:
            risks = [
                "Time constraint risk if multiple high-priority tasks overlap.",
                "Potential burnout if resting schedule is neglected."
            ]

        return {
            "agent": "Risk & Downside Agent",
            "status": "completed",
            "summary": "Risk evaluation and failure mode safety audit completed.",
            "details": f"Identified {len(risks)} primary risk factors and mitigation strategies.",
            "risks": risks
        }
