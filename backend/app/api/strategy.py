from fastapi import APIRouter

from app.api.projects import service

router = APIRouter(prefix="/api/projects", tags=["strategy"])


@router.post("/{project_id}/positioning")
def positioning(project_id: str) -> object:
    return service.positioning(project_id)


@router.post("/{project_id}/personality")
def personality(project_id: str) -> object:
    return service.personality(project_id)