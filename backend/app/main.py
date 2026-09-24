import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")
load_dotenv()

from app.api import battle, brand_system, critic, discovery, projects, strategy

app = FastAPI(title="BrandForge AI API", version="1.0.0")
app.include_router(projects.router)
app.include_router(discovery.router)
app.include_router(strategy.router)
app.include_router(battle.router)
app.include_router(critic.router)
app.include_router(brand_system.router)


@app.get("/health")
def health():
    return {"status": "ok", "mode": "live" if os.getenv("LLM_API_KEY") else "demo"}
