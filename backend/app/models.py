from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Reminder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    due_at: Optional[datetime] = None
    done: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
