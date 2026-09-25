import json
import os
import re
from pathlib import Path
from typing import Any, Dict

from dotenv import load_dotenv

# Load backend/.env regardless of cwd (uvicorn run from backend/ or repo root).
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")
load_dotenv()


class LLMService:
    """Provider-neutral JSON boundary. Demo agents run when no provider is configured."""

    def __init__(self) -> None:
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.base_url = os.getenv("LLM_BASE_URL", "").rstrip("/")
        self.model = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")

    @property
    def live(self) -> bool:
        return bool(self.api_key and self.base_url)

    @staticmethod
    def _strip_fences(text: str) -> str:
        cleaned = text.strip()
        fence = re.search(r"```(?:json)?\s*(.*?)```", cleaned, re.DOTALL | re.IGNORECASE)
        if fence:
            return fence.group(1).strip()
        return cleaned

    def complete_json(self, system: str, context: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
        if not self.live:
            print(f"[LLMService] demo fallback used for '{system}': provider not configured (missing LLM_API_KEY/LLM_BASE_URL)")
            return fallback
        try:
            import httpx
            schema_hint = (
                f"{system}. You MUST return ONLY a valid JSON object with exactly these top-level keys: "
                f"{sorted(fallback.keys())}. Use this example structure as the schema (adapt values to the input, "
                "keep the same keys and value types): "
                f"{json.dumps(fallback)[:4000]}"
            )
            response = httpx.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model, "temperature": 0.7, "response_format": {"type": "json_object"}, "messages": [{"role": "system", "content": schema_hint}, {"role": "user", "content": json.dumps(context)}]},
                timeout=60,
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            parsed = json.loads(self._strip_fences(content))
            if not isinstance(parsed, dict):
                raise ValueError("LLM response was not an object")
            merged = dict(fallback)
            merged.update(parsed)
            print(f"[LLMService] live Groq response used for '{system}' with model '{self.model}'")
            return merged
        except Exception as exc:
            print(f"[LLMService] live call failed for '{system}' ({type(exc).__name__}): {exc}. Using demo fallback.")
            return fallback