from typing import Dict, List

from pydantic import BaseModel, Field

from app.schemas.brand_state import BrandDirection, DirectionEvaluation, PersonalityState, PositioningState


class DiscoveryQuestion(BaseModel):
    id: str
    question: str
    why_it_matters: str


class DiscoveryOutput(BaseModel):
    questions: List[DiscoveryQuestion] = Field(default_factory=list)
    discovery: Dict[str, object]


class PositioningOutput(PositioningState):
    pass


class PersonalityOutput(PersonalityState):
    emotional_impression: str = ""


class BattleOutput(BaseModel):
    directions: List[BrandDirection] = Field(min_length=3, max_length=3)


class CriticOutput(BaseModel):
    evaluations: List[DirectionEvaluation] = Field(min_length=3, max_length=3)
    iteration: int = Field(ge=1, le=3)