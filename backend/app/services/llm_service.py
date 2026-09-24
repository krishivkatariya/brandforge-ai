import json
import os
from typing import Any, Dict, Optional


class LLMService:
    """Provider-neutral JSON boundary. Demo agents run when no provider is configured."""

    def __init__(self) -> None:
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.base_url = os.getenv("LLM_BASE_URL", "").rstrip("/")
        self.model = os.getenv("LLM_MODEL", "gpt-oss-120b")

    @property
    def live(self) -> bool:
        return bool(self.api_key and self.base_url)

    def complete_json(self, system: str, context: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
        if not self.live:
            return fallback
        try:
            import httpx
            response = httpx.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model, "temperature": 0.4, "response_format": {"type": "json_object"}, "messages": [{"role": "system", "content": system}, {"role": "user", "content": json.dumps(context)}]},
                timeout=45,
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            if not isinstance(parsed, dict):
                raise ValueError("LLM response was not an object")
            return parsed
        except Exception:
            return fallback