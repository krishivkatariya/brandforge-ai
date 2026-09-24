from app.schemas.agent_outputs import BattleOutput
from app.schemas.brand_state import BrandDirection, BrandState
from app.services.llm_service import LLMService


def run(state: BrandState) -> BattleOutput:
    name = state.project.name
    fallback = BattleOutput(directions=[
        BrandDirection(direction_name="Make it real", strategic_territory="Builder / technical", concept=f"A practical engine for making {name} useful fast.", emotional_territory="Capability and momentum", naming_style="Compact verbs and construction language", sample_names=["Forge", "Stackmate", "Buildloop"], tagline_direction="Find the right move. Make it real.", personality=["Precise", "Energetic", "Capable"], strengths=["Feels actionable", "Signals progress"], weaknesses=["Can sound like a tool"]),
        BrandDirection(direction_name="Find your people", strategic_territory="Community / crew", concept="A welcoming signal for the people who make a good idea click.", emotional_territory="Belonging and recognition", naming_style="Warm, human, easy-to-say names", sample_names=["Kinship", "Orbit", "Roommate"], tagline_direction="Good ideas need the right room.", personality=["Open", "Warm", "Encouraging"], strengths=["Lowers first-step anxiety", "Strong emotional hook"], weaknesses=["Needs proof of speed"]),
        BrandDirection(direction_name="Enter the arena", strategic_territory="Competitive / arena", concept="A rallying point for ambitious people working against the clock.", emotional_territory="Urgency and earned pride", naming_style="Short, kinetic, game-adjacent names", sample_names=["Rally", "Bracket", "Draftday"], tagline_direction="Build your winning team.", personality=["Bold", "Fast", "Ambitious"], strengths=["Memorable energy", "Creates urgency"], weaknesses=["May intimidate beginners"]),
    ])
    raw = LLMService().complete_json("Naming Agent", {"project": state.project.model_dump(), "positioning": state.positioning.model_dump(), "personality": state.personality.model_dump()}, fallback.model_dump())
    return BattleOutput.model_validate(raw)