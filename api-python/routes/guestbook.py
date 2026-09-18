import sqlite3
import time
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
import os

router = APIRouter(prefix="/api/guestbook", tags=["guestbook"])

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "guestbook.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS guestbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            dimension TEXT NOT NULL,
            created_at REAL NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

class GuestbookEntry(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    message: str = Field(..., min_length=1, max_length=280)
    dimension: str = Field(default="4D")

# In-memory rate limiting: 1 post every 10 seconds per IP
last_post_time = {}

@router.get("")
def get_entries(limit: int = 50):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, message, dimension, created_at FROM guestbook ORDER BY id DESC LIMIT ?",
        (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "name": r[1],
            "message": r[2],
            "dimension": r[3],
            "created_at": r[4]
        }
        for r in rows
    ]

@router.post("")
def add_entry(entry: GuestbookEntry, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    if client_ip in last_post_time and now - last_post_time[client_ip] < 10.0:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait 10 seconds.")
    
    last_post_time[client_ip] = now

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO guestbook (name, message, dimension, created_at) VALUES (?, ?, ?, ?)",
        (entry.name.strip(), entry.message.strip(), entry.dimension, now)
    )
    conn.commit()
    entry_id = cursor.lastrowid
    conn.close()

    return {
        "success": True,
        "id": entry_id,
        "name": entry.name,
        "message": entry.message,
        "dimension": entry.dimension,
        "created_at": now
    }
