# backend/app/schemas.py (fragment)
from pydantic import BaseModel
from datetime import datetime

class ReminderCreate(BaseModel):
    text: str
    due_at: datetime | None = None

class ReminderOut(BaseModel):
    id: int
    text: str
    due_at: datetime | None
    done: bool
    created_at: datetime
    class Config:
        from_attributes = True
