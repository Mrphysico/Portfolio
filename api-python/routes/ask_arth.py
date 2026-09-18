from fastapi import APIRouter
from pydantic import BaseModel, Field
import re

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)

KNOWLEDGE_BASE = {
    "identity": (
        "Arth Jadav is a Frontend Developer & Creative Coder. "
        "GitHub: https://github.com/Mrphysico | LinkedIn: https://www.linkedin.com/in/arth-jadav-05221435b. "
        "He builds immersive, high-performance web applications using modern TypeScript, React, and 3D graphics."
    ),
    "rigforge": (
        "RigForge (4D Flagship) is a full-stack custom PC parts e-commerce & interactive Battle Rig builder for the Indian market. "
        "Built with React 18, TypeScript, Vite, Tailwind CSS, Zustand, Node.js, Express, MongoDB, and JWT with 30-minute inactivity auto-logout. "
        "Key features: Real-time CPU socket compatibility engine (LGA1700, AM5, AM4) and DDR4/DDR5 validation, dynamic TDP power calculator, "
        "instant gaming FPS benchmarks for Cyberpunk 2077/Valorant/GTA V, Indian retail pricing with 18% GST calculation, and UPI QR payment flow."
    ),
    "accident": (
        "Smart Accident Detection System (3D Project) is a government telematics platform consisting of a high-concurrency FastAPI server, "
        "an accident simulator generating telematics packets, a centralized web command dashboard, and an Expo/React Native responder mobile application."
    ),
    "minor": (
        "Minor Project Demo (2D Project) is Arth's 6th-semester academic minor project built with HTML, CSS, and JavaScript, "
        "demonstrating structured DOM manipulation and interactive UI components."
    ),
    "amazon": (
        "Amazon Clone (1D Project) was Arth's very first web project, handcrafted in pure HTML and CSS while learning web fundamentals from YouTube in Feb 2025."
    ),
    "skills": (
        "Core languages verified across Arth's repositories: TypeScript, JavaScript, Python, HTML, CSS. "
        "Technologies used in this portfolio: Rust (WASM 4D math), Go (real-time WebSocket presence), GLSL/WGSL (shaders), and SQLite/SQL."
    )
}

@router.post("/ask-arth")
def ask_arth(req: ChatRequest):
    q = req.query.lower()

    if any(k in q for k in ["who", "arth", "about", "bio", "experience"]):
        answer = KNOWLEDGE_BASE["identity"]
    elif any(k in q for k in ["rigforge", "pc", "rig", "builder", "compatibility", "fps"]):
        answer = KNOWLEDGE_BASE["rigforge"]
    elif any(k in q for k in ["accident", "detection", "fastapi", "simulator", "emergency"]):
        answer = KNOWLEDGE_BASE["accident"]
    elif any(k in q for k in ["minor", "semester", "college"]):
        answer = KNOWLEDGE_BASE["minor"]
    elif any(k in q for k in ["amazon", "first", "youtube", "clone"]):
        answer = KNOWLEDGE_BASE["amazon"]
    elif any(k in q for k in ["skill", "languages", "stack", "tech"]):
        answer = KNOWLEDGE_BASE["skills"]
    elif any(k in q for k in ["contact", "email", "hire", "phone", "reach"]):
        answer = (
            "You can reach Arth via GitHub (https://github.com/Mrphysico) or "
            "LinkedIn (https://www.linkedin.com/in/arth-jadav-05221435b). "
            "Direct email is available via the Contact Singularity form."
        )
    else:
        answer = (
            "I only answer verified facts from Arth Jadav's portfolio and repositories. "
            "You can ask about his flagship project RigForge, the Smart Accident Detection System, "
            "his 6th-semester Minor Project, the Amazon Clone, or his verified skill stack."
        )

    return {
        "query": req.query,
        "answer": answer,
        "grounded": True,
        "source": "content.ts"
    }
