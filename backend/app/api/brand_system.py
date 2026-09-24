from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.api.projects import service

router = APIRouter(prefix="/api/projects", tags=["brand-system"])


class GuardianRequest(BaseModel):
    content: str = Field(min_length=1, max_length=10000)


@router.post("/{project_id}/visual")
def visual(project_id: str) -> object:
    return service.visual(project_id).model_dump()


@router.post("/{project_id}/voice")
def voice(project_id: str) -> object:
    return service.voice(project_id).model_dump()


@router.post("/{project_id}/guardian")
def guardian(project_id: str, payload: GuardianRequest) -> object:
    return service.guardian(project_id, payload.content).model_dump()


@router.post("/{project_id}/launch")
def launch(project_id: str) -> object:
    return service.launch(project_id).model_dump()


@router.get("/{project_id}/brand-kit")
def brand_kit(project_id: str) -> object:
    return service.brand_kit(project_id).model_dump()