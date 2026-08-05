class ProfilerAgent:
    """
    Profiler Agent: Evaluates user's twin memory, past habits, active goals, 
    and preferred style to contextualize the decision.
    """
    def run(self, user_profile: dict, query: str) -> dict:
        goals = user_profile.get("goals", ["Career Growth", "Personal Well-being"])
        budget = user_profile.get("budget", "Medium")
        job_pref = user_profile.get("job_preference", "Private")
        comm_style = user_profile.get("communication_style", "Encouraging & Direct")
        
        insight = (
            f"User profile context loaded: Primary goals include {', '.join(goals[:2])}. "
            f"Budget constraint: {budget}, Job preference: {job_pref}. "
            f"Communication tone calibrated to '{comm_style}'."
        )
        
        return {
            "agent": "Profiler Agent",
            "status": "completed",
            "summary": "Twin memory and user context analyzed.",
            "details": insight,
            "profile_context": {
                "goals": goals,
                "budget": budget,
                "job_pref": job_pref
            }
        }
