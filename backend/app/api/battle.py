from fastapi import APIRouter

from app.api.projects import service

router = APIRouter(prefix="/api/projects", tags=["battle"])


@router.post("/{project_id}/battle")
def battle(project_id: str) -> object:
    return service.battle(project_id)