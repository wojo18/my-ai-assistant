# backend/app/models.py (fragment)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime

Base = declarative_base()

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    due_at = Column(DateTime, nullable=True)
    done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
