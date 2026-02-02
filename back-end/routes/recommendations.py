from fastapi import APIRouter, HTTPException
import json
from pathlib import Path

router = APIRouter()

UNIVERSITY_FILE = Path("data/universities.json")
RESULT_FILE = Path("data/result.json")

@router.get("/")
def get_recommendation():
    if not RESULT_FILE.exists():
        raise HTTPException(status_code=400, detail="Quiz not completed")

    with open(RESULT_FILE, "r") as f:
        result = json.load(f)

    with open(UNIVERSITY_FILE, "r") as f:
        universities = json.load(f)

    career_data = universities.get(result["career_tag"])

    return {
        "career": career_data["career"],
        "confidence": result["confidence"],
        "degree_programs": career_data["degrees"],
        "universities": career_data["universities"],
        "explanation": f"Based on your academic background and aptitude, {career_data['career']} is a strong match for you."
    }
