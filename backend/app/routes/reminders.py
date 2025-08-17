from fastapi import APIRouter, HTTPException
from sqlmodel import select
from datetime import datetime
from ..schemas import ReminderCreate, ReminderRead, ReminderUpdate
from ..models import Reminder
from ..db import get_session

router = APIRouter()


@router.get("/reminders", response_model=list[ReminderRead])
def list_reminders():
    with get_session() as s:
        return s.exec(select(Reminder).order_by(Reminder.due_at.is_(None), Reminder.due_at, Reminder.id.desc())).all()


@router.post("/reminders", response_model=ReminderRead)
def create_reminder(payload: ReminderCreate):
    with get_session() as s:
        item = Reminder(text=payload.text, due_at=payload.due_at)
        s.add(item)
        s.commit()
        s.refresh(item)
        return item


@router.patch("/reminders/{rid}", response_model=ReminderRead)
def update_reminder(rid: int, payload: ReminderUpdate):
    with get_session() as s:
        item = s.get(Reminder, rid)
        if not item:
            raise HTTPException(status_code=404, detail="Not found")
        if payload.text is not None:
            item.text = payload.text
        if payload.due_at is not None:
            item.due_at = payload.due_at
        if payload.done is not None:
            item.done = payload.done
        item.updated_at = datetime.utcnow()
        s.add(item)
        s.commit()
        s.refresh(item)
        return item


@router.delete("/reminders/{rid}")
def delete_reminder(rid: int):
    with get_session() as s:
        item = s.get(Reminder, rid)
        if not item:
            raise HTTPException(status_code=404, detail="Not found")
        s.delete(item)
        s.commit()
        return {"ok": True}
