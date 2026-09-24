from app.schemas.brand_state import BrandState, PersonalityState
from app.services.llm_service import LLMService


def run(state: BrandState) -> PersonalityState:
    fallback = PersonalityState(traits=["Open", "Resourceful", "Specific", "Momentum-driven"], traits_to_avoid=["Corporate", "Generic", "Overly formal"], principles=["Make the next step obvious", "Invite before you impress", "Reward useful momentum"])
    raw = LLMService().complete_json("Personality Agent", {"discovery": state.discovery.model_dump(), "positioning": state.positioning.model_dump()}, fallback.model_dump())
    return PersonalityState.model_validate(raw)