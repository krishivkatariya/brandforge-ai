from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ProjectState(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    idea: str = Field(min_length=10, max_length=4000)
    goal: str = "Build a clear, useful brand for the idea."
    constraints: List[str] = Field(default_factory=list)


class DiscoveryState(BaseModel):
    problem: str = ""
    target_users: List[str] = Field(default_factory=list)
    pain_points: List[str] = Field(default_factory=list)
    needs: List[str] = Field(default_factory=list)
    context: str = ""
    existing_alternatives: List[str] = Field(default_factory=list)
    open_questions: List[str] = Field(default_factory=list)


class PositioningState(BaseModel):
    category: str = ""
    target_audience: str = ""
    core_problem: str = ""
    value_proposition: str = ""
    differentiator: str = ""
    positioning_statement: str = ""
    competitive_angle: str = ""


class PersonalityState(BaseModel):
    traits: List[str] = Field(default_factory=list)
    traits_to_avoid: List[str] = Field(default_factory=list)
    principles: List[str] = Field(default_factory=list)


class NamingState(BaseModel):
    territories: List[str] = Field(default_factory=list)
    candidates: List[str] = Field(default_factory=list)


class BrandDirection(BaseModel):
    direction_name: str
    strategic_territory: str
    concept: str
    emotional_territory: str
    naming_style: str
    sample_names: List[str] = Field(min_length=3, max_length=5)
    tagline_direction: str
    personality: List[str]
    strengths: List[str]
    weaknesses: List[str]


class EvaluationScores(BaseModel):
    audience_fit: int = Field(ge=0, le=10)
    problem_alignment: int = Field(ge=0, le=10)
    distinctiveness: int = Field(ge=0, le=10)
    memorability: int = Field(ge=0, le=10)
    clarity: int = Field(ge=0, le=10)
    personality_alignment: int = Field(ge=0, le=10)
    genericity_risk: int = Field(ge=0, le=10)
    consistency: int = Field(ge=0, le=10)


class DirectionEvaluation(BaseModel):
    direction_index: int = Field(ge=0, le=2)
    decision: str
    scores: EvaluationScores
    issues: List[str] = Field(default_factory=list)
    evidence: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class EvaluationState(BaseModel):
    iteration: int = 0
    evaluations: List[DirectionEvaluation] = Field(default_factory=list)


class FinalBrand(BaseModel):
    name: str = ""
    tagline: str = ""
    pitch: str = ""
    strategy: PositioningState = Field(default_factory=PositioningState)
    personality: PersonalityState = Field(default_factory=PersonalityState)
    voice: Dict[str, object] = Field(default_factory=dict)
    visual_direction: Dict[str, object] = Field(default_factory=dict)


class BrandState(BaseModel):
    project: ProjectState
    discovery: DiscoveryState = Field(default_factory=DiscoveryState)
    positioning: PositioningState = Field(default_factory=PositioningState)
    personality: PersonalityState = Field(default_factory=PersonalityState)
    naming: NamingState = Field(default_factory=NamingState)
    brand_directions: List[BrandDirection] = Field(default_factory=list)
    selected_direction: Optional[BrandDirection] = None
    evaluation: EvaluationState = Field(default_factory=EvaluationState)
    final_brand: Optional[FinalBrand] = None
    current_stage: str = "discovery"