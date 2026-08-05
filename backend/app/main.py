from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
import app.models
from seed_data import seed_database
from app.routers import (
    auth,
    twin,
    decisions,
    features,
    education,
    customer_support,
    healthcare,
    business,
    personal_assistant,
    content_creation,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & seed data on startup
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Seed note: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Decision Intelligence Platform featuring Multi-Agent AI, Twin Memory, and 6 Domain Modules.",
    lifespan=lifespan
)

# Enable CORS for Frontend React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(twin.router)
app.include_router(decisions.router)
app.include_router(features.router)
app.include_router(education.router)
app.include_router(customer_support.router)
app.include_router(healthcare.router)
app.include_router(business.router)
app.include_router(personal_assistant.router)
app.include_router(content_creation.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "AI Twin Multi-Agent Backend Server is running smoothly."
    }
