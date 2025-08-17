import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI SDK v1+
try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None

MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")


def ask_llm(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        # Tryb fallback – bezpośrednia odpowiedź, aby nie wykrzaczyć się lokalnie
        return "[LLM disabled] Echo: " + prompt[:200]

    client = OpenAI(api_key=api_key)
    resp = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful private AI assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )
    return resp.choices[0].message.content.strip()
