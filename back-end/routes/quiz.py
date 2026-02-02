from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

QUIZ_FILE = Path("data/quiz.json")
RESULT_FILE = Path("data/result.json")

@router.get("/questions")
def get_quiz_questions():
    with open(QUIZ_FILE, "r") as f:
        return json.load(f)["questions"]


@router.post("/submit")
def submit_quiz(payload: dict):
    """
    payload = {
        "answers": [
            {"question_id": 1, "answer": "tech"},
            {"question_id": 2, "answer": "tech"}
        ]
    }
    """
    answers = payload["answers"]

    score = {}
    for item in answers:
        tag = item["answer"]
        score[tag] = score.get(tag, 0) + 1

    recommended = max(score, key=score.get)
    confidence = round(score[recommended] / len(answers), 2)

    result = {
        "career_tag": recommended,
        "confidence": confidence
    }

    # 🔴 SAVE RESULT FOR RECOMMENDATION PAGE
    with open(RESULT_FILE, "w") as f:
        json.dump(result, f)

    return {"message": "Quiz submitted successfully"}
