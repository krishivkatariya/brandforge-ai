from typing import Dict

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.orchestration_service import OrchestrationService

router = APIRouter(prefix="/api/projects", tags=["projects"])
service = OrchestrationService()


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    idea: str = Field(min_length=10, max_length=4000)


class DirectionSelection(BaseModel):
    direction_index: int = Field(ge=0, le=2)


@router.post("", status_code=201)
def create_project(payload: ProjectCreate) -> Dict[str, object]:
    project_id, state = service.create(payload.name, payload.idea)
    return {"id": project_id, "state": state.model_dump()}


@router.get("/{project_id}")
def get_project(project_id: str) -> Dict[str, object]:
    return service.get(project_id).model_dump()


@router.post("/{project_id}/select-direction")
def select_direction(project_id: str, payload: DirectionSelection) -> Dict[str, object]:
    return service.select(project_id, payload.direction_index).model_dump()