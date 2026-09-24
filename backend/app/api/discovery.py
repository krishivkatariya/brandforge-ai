from typing import Dict

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.api.projects import service

router = APIRouter(prefix="/api/projects", tags=["discovery"])


class DiscoveryAnswers(BaseModel):
    answers: Dict[str, str] = Field(default_factory=dict)


@router.post("/{project_id}/discovery")
def run_discovery(project_id: str, payload: DiscoveryAnswers) -> object:
    return service.discovery(project_id, payload.answers)