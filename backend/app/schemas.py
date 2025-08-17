from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AskRequest(BaseModel):
    prompt: str


class AskResponse(BaseModel):
    answer: str


class ReminderCreate(BaseModel):
    text: str
    due_at: Optional[datetime] = None


class ReminderRead(BaseModel):
    id: int
    text: str
    due_at: Optional[datetime]
    done: bool
    created_at: datetime
    updated_at: datetime


class ReminderUpdate(BaseModel):
    text: Optional[str] = None
    due_at: Optional[datetime] = None
    done: Optional[bool] = None
