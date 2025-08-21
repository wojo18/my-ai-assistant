# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import health, ask, reminders

app = FastAPI(title="My AI Assistant API")

origins = []
if os.getenv("WEB_ORIGIN"):
    origins.append(os.getenv("WEB_ORIGIN"))
# lokalnie:
origins += ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],  # na produkcji lepiej lista konkretnych domen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(ask.router, prefix="/ask", tags=["llm"])
app.include_router(reminders.router, prefix="/reminders", tags=["reminders"])

@app.get("/")
def root():
    return {"ok": True, "name": "My AI Assistant API"}
