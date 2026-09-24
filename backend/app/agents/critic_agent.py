from app.schemas.agent_outputs import CriticOutput
from app.schemas.brand_state import BrandState, DirectionEvaluation, EvaluationScores
from app.services.llm_service import LLMService


def run(state: BrandState, iteration: int = 1) -> CriticOutput:
    evaluations = []
    for index, direction in enumerate(state.brand_directions):
        risk = 5 if index == 0 else 2 if index == 1 else 6
        scores = EvaluationScores(audience_fit=8 if index == 1 else 7, problem_alignment=8, distinctiveness=7 if index == 1 else 6, memorability=8 if index == 2 else 7, clarity=8, personality_alignment=8 if index == 1 else 7, genericity_risk=risk, consistency=8)
        evaluations.append(DirectionEvaluation(direction_index=index, decision="REVISE" if risk >= 6 else "KEEP", scores=scores, issues=["Naming territory needs a more ownable verbal hook"] if risk >= 6 else [], evidence=[f"{direction.strategic_territory} matches the problem through {direction.emotional_territory.lower()}.", "The direction uses the audience and positioning context."], recommendations=["Replace familiar category language with a sharper, more specific cue."] if risk >= 6 else ["Protect the emotional territory in future copy."]))
    fallback = CriticOutput(iteration=iteration, evaluations=evaluations)
    raw = LLMService().complete_json("Critic Agent", {"directions": [item.model_dump() for item in state.brand_directions], "discovery": state.discovery.model_dump(), "personality": state.personality.model_dump()}, fallback.model_dump())
    return CriticOutput.model_validate(raw)