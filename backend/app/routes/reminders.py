# backend/app/routes/reminders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal, engine
from ..models import Base, Reminder
from ..schemas import ReminderCreate, ReminderOut

router = APIRouter()

# tworzenie tabel przy starcie (prosto na start; docelowo Alembic)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=ReminderOut)
def create_reminder(payload: ReminderCreate, db: Session = Depends(get_db)):
    r = Reminder(text=payload.text, due_at=payload.due_at)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("", response_model=list[ReminderOut])
def list_reminders(db: Session = Depends(get_db)):
    return db.query(Reminder).order_by(Reminder.created_at.desc()).all()

@router.post("/{rid}/done", response_model=ReminderOut)
def mark_done(rid: int, db: Session = Depends(get_db)):
    r = db.query(Reminder).get(rid)
    if not r:
        raise HTTPException(404, "Not found")
    r.done = True
    db.commit()
    db.refresh(r)
    return r
