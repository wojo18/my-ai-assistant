from fastapi import APIRouter
from ..schemas import AskRequest, AskResponse
from ..services.llm import ask_llm

router = APIRouter()


@router.post("/ask", response_model=AskResponse)
async def ask(data: AskRequest):
    answer = ask_llm(data.prompt)
    return AskResponse(answer=answer)
