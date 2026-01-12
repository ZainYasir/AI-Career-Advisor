from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

UNIVERSITY_FILE = Path("data/universities.json")

@router.post("/")
def get_recommendation(result: dict):
    """
    result = {
        "career_tag": "tech",
        "confidence": 66.7
    }
    """

    with open(UNIVERSITY_FILE, "r") as f:
        data = json.load(f)

    career_data = data.get(result["career_tag"])

    return {
        "recommended_career": career_data["career"],
        "confidence_score": result["confidence"],
        "degrees": career_data["degrees"],
        "universities": career_data["universities"],
        "explanation": f"Based on your interests and strengths, you are well-suited for a career in {career_data['career']}."
    }
