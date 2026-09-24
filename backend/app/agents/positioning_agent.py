from app.schemas.brand_state import BrandState, PositioningState
from app.services.llm_service import LLMService


def run(state: BrandState) -> PositioningState:
    discovery = state.discovery
    audience = discovery.target_users[0] if discovery.target_users else "early adopters"
    problem = discovery.problem or state.project.idea
    fallback = PositioningState(
        category="guided coordination platform",
        target_audience=audience,
        core_problem=problem,
        value_proposition=f"Help {audience.lower()} move from uncertainty to a confident first step.",
        differentiator="It turns a vague need into a relevant, human-feeling match or next action.",
        positioning_statement=f"For {audience.lower()} who need {problem.lower()}, {state.project.name} is the guided coordination platform that makes the right next move feel obvious.",
        competitive_angle="Clarity and fit over noisy directories or generic one-size-fits-all tools.",
    )
    raw = LLMService().complete_json("Positioning Agent", {"project": state.project.model_dump(), "discovery": discovery.model_dump()}, fallback.model_dump())
    return PositioningState.model_validate(raw)