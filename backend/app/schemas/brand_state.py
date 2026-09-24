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


class VisualIdentityState(BaseModel):
    color_palette: List[str] = Field(default_factory=list)
    typography: List[str] = Field(default_factory=list)
    imagery_style: str = ""
    composition: str = ""
    symbols: List[str] = Field(default_factory=list)
    ui_direction: str = ""
    things_to_avoid: List[str] = Field(default_factory=list)


class BrandVoiceState(BaseModel):
    tone: str = ""
    vocabulary: List[str] = Field(default_factory=list)
    sentence_style: str = ""
    writing_rules: List[str] = Field(default_factory=list)
    words_to_use: List[str] = Field(default_factory=list)
    words_to_avoid: List[str] = Field(default_factory=list)
    example_headline: str = ""
    example_product_description: str = ""
    example_social_post: str = ""
    example_cta: str = ""


class GuardianState(BaseModel):
    content: str = ""
    overall_evaluation: str = ""
    audience_fit: int = Field(default=0, ge=0, le=10)
    positioning_alignment: int = Field(default=0, ge=0, le=10)
    personality_alignment: int = Field(default=0, ge=0, le=10)
    voice_alignment: int = Field(default=0, ge=0, le=10)
    genericity_risk: int = Field(default=0, ge=0, le=10)
    problems: List[str] = Field(default_factory=list)
    explanation: str = ""
    recommendations: List[str] = Field(default_factory=list)
    improved_version: str = ""


class LaunchContentState(BaseModel):
    headline: str = ""
    subheadline: str = ""
    one_line_pitch: str = ""
    product_description: str = ""
    social_post: str = ""
    cta: str = ""


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
    visual_identity: VisualIdentityState = Field(default_factory=VisualIdentityState)
    brand_voice: BrandVoiceState = Field(default_factory=BrandVoiceState)
    guardian: Optional[GuardianState] = None
    launch: LaunchContentState = Field(default_factory=LaunchContentState)
    final_brand: Optional[FinalBrand] = None
    current_stage: str = "discovery"