"""Small provider-agnostic API shell for live BrandForge integrations."""

import os
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="BrandForge AI API", version="0.1.0")


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    idea: str = Field(min_length=10, max_length=2000)


class GuardianRequest(BaseModel):
    content: str = Field(min_length=1, max_length=10000)
    brand_state: Dict[str, Any] = Field(default_factory=dict)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "mode": "live" if os.getenv("LLM_API_KEY") else "demo"}


@app.post("/api/projects", status_code=201)
def create_project(payload: ProjectCreate) -> Dict[str, Any]:
    return {"id": "local-project", "name": payload.name, "idea": payload.idea, "stage": "discovery"}


@app.post("/api/projects/{project_id}/guardian")
def guardian(project_id: str, payload: GuardianRequest) -> Dict[str, Any]:
    if not project_id:
        raise HTTPException(status_code=400, detail="Project id is required")
    generic = any(word in payload.content.lower() for word in ("comprehensive", "solution", "leverage"))
    return {
        "decision": "REVISE" if generic else "KEEP",
        "overall": 62 if generic else 88,
        "problems": ["Generic corporate vocabulary"] if generic else [],
        "revised": payload.content if not generic else "Make the next build move with the right people.",
    }