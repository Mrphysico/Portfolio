from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

from routes.guestbook import router as guestbook_router
from routes.github_stats import router as github_router
from routes.ask_arth import router as ask_arth_router

app = FastAPI(
    title="Arth Jadav Portfolio API",
    description="Backend microservices for The Dimensional Portfolio (Guestbook, GitHub Stats, Ask Arth)",
    version="1.0.0"
)

# CORS configuration allowing local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guestbook_router)
app.include_router(github_router)
app.include_router(ask_arth_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "api-python",
        "timestamp": time.time()
    }
