import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")
load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

from app.api import battle, brand_system, critic, discovery, projects, strategy

app = FastAPI(title="BrandForge AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(projects.router)
app.include_router(discovery.router)
app.include_router(strategy.router)
app.include_router(battle.router)
app.include_router(critic.router)
app.include_router(brand_system.router)


@app.get("/health")
def health():
    return {"status": "ok", "mode": "live" if os.getenv("LLM_API_KEY") else "demo"}
