import time
import httpx
from fastapi import APIRouter

router = APIRouter(prefix="/api/github", tags=["github"])

# Cache profile & repo statistics for 10 minutes
CACHE = {
    "data": None,
    "last_fetched": 0
}

FALLBACK_DATA = {
    "login": "Mrphysico",
    "name": "Arth Jadav",
    "public_repos": 5,
    "followers": 1,
    "following": 1,
    "top_languages": [
        {"name": "TypeScript", "color": "#3178c6", "percentage": 42},
        {"name": "Python", "color": "#3776ab", "percentage": 30},
        {"name": "JavaScript", "color": "#f7df1e", "percentage": 15},
        {"name": "HTML/CSS", "color": "#e34f26", "percentage": 13}
    ],
    "featured_repos": [
        {"name": "RigForge", "stars": 0, "language": "TypeScript"},
        {"name": "SMART-ACCIDENT-DETCETION-SYSTEM", "stars": 0, "language": "Python"},
        {"name": "MINOR-PROJECT-DEMO", "stars": 0, "language": "CSS/JS"},
        {"name": "Amazon-clone", "stars": 0, "language": "HTML"}
    ]
}

@router.get("/stats")
async def get_github_stats():
    now = time.time()
    if CACHE["data"] and (now - CACHE["last_fetched"] < 600):
        return CACHE["data"]

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            user_res = await client.get("https://api.github.com/users/Mrphysico")
            repos_res = await client.get("https://api.github.com/users/Mrphysico/repos")

            if user_res.status_code == 200 and repos_res.status_code == 200:
                user_json = user_res.json()
                repos_json = repos_res.json()

                lang_counts = {}
                for r in repos_json:
                    lang = r.get("language")
                    if lang:
                        lang_counts[lang] = lang_counts.get(lang, 0) + 1

                total = sum(lang_counts.values()) or 1
                top_langs = [
                    {"name": k, "percentage": round((v / total) * 100)}
                    for k, v in sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)
                ]

                data = {
                    "login": user_json.get("login", "Mrphysico"),
                    "name": user_json.get("name", "Arth Jadav"),
                    "public_repos": user_json.get("public_repos", 5),
                    "followers": user_json.get("followers", 0),
                    "following": user_json.get("following", 0),
                    "top_languages": top_langs,
                    "featured_repos": [
                        {"name": r["name"], "stars": r["stargazers_count"], "language": r.get("language", "Unknown")}
                        for r in repos_json[:4]
                    ]
                }
                CACHE["data"] = data
                CACHE["last_fetched"] = now
                return data
    except Exception:
        pass

    return FALLBACK_DATA
