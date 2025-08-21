# backend/app/services/llm.py
import os
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")

class LLMClient:
    def __init__(self, api_key: str | None = OPENAI_API_KEY):
        self.api_key = api_key

    async def complete(self, prompt: str) -> str:
        if not self.api_key:
            return "LLM not configured."
        # minimalny call do OpenAI Chat Completions (JSON mode)
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": LLM_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            data = r.json()
            return data["choices"][0]["message"]["content"]
