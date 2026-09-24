from typing import Dict
from uuid import uuid4

from fastapi import HTTPException

from app.agents import critic_agent, naming_agent, personality_agent, positioning_agent, discovery_agent, brand_system_agent
from app.schemas.brand_state import BrandState, DiscoveryState, EvaluationState, FinalBrand, NamingState


class OrchestrationService:
    def __init__(self) -> None:
        self.projects: Dict[str, BrandState] = {}

    def create(self, name: str, idea: str) -> tuple:
        project_id = str(uuid4())
        state = BrandState(project={"name": name, "idea": idea})
        self.projects[project_id] = state
        return project_id, state

    def get(self, project_id: str) -> BrandState:
        if project_id not in self.projects:
            raise HTTPException(status_code=404, detail="Project not found")
        return self.projects[project_id]

    def discovery(self, project_id: str, answers: Dict[str, str]) -> object:
        state = self.get(project_id)
        result = discovery_agent.run(state, answers)
        state.discovery = DiscoveryState.model_validate(result.discovery)
        state.current_stage = "positioning" if not result.questions else "discovery"
        return result

    def positioning(self, project_id: str) -> object:
        state = self.get(project_id)
        state.positioning = positioning_agent.run(state)
        state.current_stage = "personality"
        return state.positioning

    def personality(self, project_id: str) -> object:
        state = self.get(project_id)
        state.personality = personality_agent.run(state)
        state.current_stage = "battle"
        return state.personality

    def battle(self, project_id: str) -> object:
        state = self.get(project_id)
        result = naming_agent.run(state)
        state.brand_directions = result.directions
        state.naming = NamingState(territories=[item.strategic_territory for item in result.directions], candidates=[name for item in result.directions for name in item.sample_names])
        state.current_stage = "critic"
        return result

    def critic(self, project_id: str) -> object:
        state = self.get(project_id)
        result = critic_agent.run(state, min(state.evaluation.iteration + 1, 3))
        state.evaluation = EvaluationState(iteration=result.iteration, evaluations=result.evaluations)
        state.current_stage = "selection"
        return result

    def select(self, project_id: str, direction_index: int) -> BrandState:
        state = self.get(project_id)
        if direction_index < 0 or direction_index >= len(state.brand_directions):
            raise HTTPException(status_code=400, detail="Direction index is invalid")
        selected = state.brand_directions[direction_index]
        state.selected_direction = selected
        state.current_stage = "brand_kit"
        state.final_brand = FinalBrand(name=selected.sample_names[0], tagline=selected.tagline_direction, pitch=state.positioning.value_proposition, strategy=state.positioning, personality=state.personality, voice={"tone": "direct, warm, useful", "rules": ["Use active verbs", "Invite before you impress"]}, visual_direction={"colors": ["ink", "signal orange", "soft mint"], "typography": "expressive grotesk with compact mono labels", "imagery": "real people in motion", "things_to_avoid": ["stock corporate scenes", "generic gradients"]})
        return state

    def visual(self, project_id: str) -> BrandState:
        state = self.get(project_id)
        if not state.selected_direction:
            raise HTTPException(status_code=400, detail="Select a brand direction first")
        state.visual_identity = brand_system_agent.visual(state)
        state.current_stage = "voice"
        return state

    def voice(self, project_id: str) -> BrandState:
        state = self.get(project_id)
        if not state.selected_direction:
            raise HTTPException(status_code=400, detail="Select a brand direction first")
        state.brand_voice = brand_system_agent.voice(state)
        state.current_stage = "guardian"
        return state

    def guardian(self, project_id: str, content: str) -> BrandState:
        state = self.get(project_id)
        if not state.selected_direction:
            raise HTTPException(status_code=400, detail="Select a brand direction first")
        state.guardian = brand_system_agent.guardian(state, content)
        state.current_stage = "launch"
        return state

    def launch(self, project_id: str) -> BrandState:
        state = self.get(project_id)
        if not state.selected_direction:
            raise HTTPException(status_code=400, detail="Select a brand direction first")
        state.launch = brand_system_agent.launch(state)
        state.current_stage = "brand_kit"
        return state

    def brand_kit(self, project_id: str) -> BrandState:
        state = self.get(project_id)
        if not state.selected_direction:
            raise HTTPException(status_code=400, detail="Select a brand direction first")
        return state