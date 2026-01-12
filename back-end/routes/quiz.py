from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

QUIZ_FILE = Path("data/quiz.json")

@router.get("/questions")
def get_quiz_questions():
    with open(QUIZ_FILE, "r") as f:
        data = json.load(f)
    return data["questions"]


@router.post("/submit")
def submit_quiz(answers: list):
    """
    answers = ["tech", "tech", "business"]
    """
    score = {}

    for tag in answers:
        score[tag] = score.get(tag, 0) + 1

    recommended_career = max(score, key=score.get)
    confidence = round((score[recommended_career] / len(answers)) * 100, 2)

    return {
        "career_tag": recommended_career,
        "confidence": confidence
    }
