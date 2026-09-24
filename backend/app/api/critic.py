from fastapi import APIRouter

from app.api.projects import service

router = APIRouter(prefix="/api/projects", tags=["critic"])


@router.post("/{project_id}/critic")
def critic(project_id: str) -> object:
    return service.critic(project_id)