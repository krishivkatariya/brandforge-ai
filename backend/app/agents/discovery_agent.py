from typing import Dict, List

from app.schemas.agent_outputs import DiscoveryOutput
from app.schemas.brand_state import BrandState, DiscoveryState
from app.services.llm_service import LLMService


def run(state: BrandState, answers: Dict[str, str]) -> DiscoveryOutput:
    idea = state.project.idea
    subject = idea.split(" that ")[-1].rstrip(".")
    target = answers.get("target_users", "people who need this outcome")
    problem = answers.get("problem", f"People struggle to {subject.lower()} without a clear, trusted path.")
    alternatives = answers.get("alternatives", "search, spreadsheets, and word of mouth")
    discovery = DiscoveryState(
        problem=problem,
        target_users=[target],
        pain_points=["High friction before the first useful action", "Existing options feel fragmented"],
        needs=["A clear next step", "Confidence that the choice will fit"],
        context=answers.get("context", f"The idea is at an early stage: {idea}"),
        existing_alternatives=[alternatives],
        open_questions=[] if answers else ["Who is the primary user?", "What problem are they facing?", "What alternatives exist?"]
    )
    questions = [] if answers else [
        {"id": "target_users", "question": "Who is the primary user you want to win first?", "why_it_matters": "Audience language determines the brand's center of gravity."},
        {"id": "problem", "question": "What frustrating problem are they experiencing today?", "why_it_matters": "A specific tension produces a sharper position."},
        {"id": "alternatives", "question": "What do they use or do instead right now?", "why_it_matters": "The alternative reveals where your difference can matter."},
    ]
    fallback = {"questions": questions, "discovery": discovery.model_dump()}
    raw = LLMService().complete_json("Discovery Agent", {"idea": idea, "answers": answers}, fallback)
    return DiscoveryOutput.model_validate(raw)