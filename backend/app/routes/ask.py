# backend/app/routes/ask.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse, StreamingResponse
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

# (opcjonalnie) streaming – pseudo-SSE (text/event-stream)
@router.post("/stream")
async def ask_stream(payload: dict):
    q = (payload.get("q") or "").strip()
    if not q:
        raise HTTPException(400, "Missing 'q'")

    async def gen():
        text = await llm.complete(q)
        # rozbij na kawałki
        for chunk in text.split():
            yield f"data: {chunk}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")
