from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from ..services.llm import LLMClient

router = APIRouter()
llm = LLMClient()

@router.post("", response_class=PlainTextResponse)
async def ask(payload: dict):
    q = (payload.get("q") or "").strip()
    if not q:
        raise HTTPException(400, "Missing 'q'")
    answer = await llm.complete(q)
    return answer
