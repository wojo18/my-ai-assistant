import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routes import health, ask, reminders

app = FastAPI(title="Private AI Assistant API")

origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(health.router, tags=["health"])  # GET /health
app.include_router(ask.router, tags=["ask"])        # POST /ask
app.include_router(reminders.router, tags=["reminders"])  # CRUD
