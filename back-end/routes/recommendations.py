from fastapi import APIRouter, HTTPException
import json
from pathlib import Path
import joblib

router = APIRouter()

# Resolve paths relative to project root (backend/)
BASE_DIR = Path(__file__).resolve().parent.parent

UNIVERSITY_FILE = BASE_DIR / "data" / "universities.json"
RESULT_FILE = BASE_DIR / "data" / "result.json"
MODEL_FILE = BASE_DIR / "ml" / "model.pkl"

# Load universities data once
if not UNIVERSITY_FILE.exists():
    raise RuntimeError(f"Universities file not found at {UNIVERSITY_FILE}")
with open(UNIVERSITY_FILE, "r") as f:
    universities = json.load(f)

# Load ML model
if MODEL_FILE.exists():
    model = joblib.load(MODEL_FILE)
    print(f"[INFO] ML model loaded from {MODEL_FILE}")
else:
    model = None
    print(f"[WARNING] ML model not found. Falling back to result.json for recommendations.")

@router.get("/")
def get_recommendation():
    """
    Returns career recommendation.
    If ML model exists, can use it to predict.
    Else fallback to last quiz result in result.json.
    """

    # If ML model exists, you can implement real prediction logic here.
    if model:
        # For demonstration, let's just read result.json as proxy
        if not RESULT_FILE.exists():
            raise HTTPException(status_code=400, detail="Quiz not completed")
        with open(RESULT_FILE, "r") as f:
            result = json.load(f)

        career_tag = result.get("career_tag")
        confidence = result.get("confidence", 0.5)

        # Here you could implement actual model.predict(...)
        # Example:
        # input_features = [...]  # prepare features from quiz answers
        # pred = model.predict([input_features])
        # career_tag = map_prediction_to_tag(pred)
        # confidence = model.predict_proba([input_features])[0].max()

    else:
        # No model, fallback
        if not RESULT_FILE.exists():
            raise HTTPException(status_code=400, detail="Quiz not completed and no ML model available")
        with open(RESULT_FILE, "r") as f:
            result = json.load(f)
        career_tag = result.get("career_tag")
        confidence = result.get("confidence", 0.5)
        print("[INFO] Using proxy recommendation from result.json")

    career_data = universities.get(career_tag)
    if not career_data:
        raise HTTPException(status_code=404, detail=f"No career data found for tag '{career_tag}'")

    return {
        "career": career_data["career"],
        "confidence": confidence,
        "degree_programs": career_data["degrees"],
        "universities": career_data["universities"],
        "explanation": f"Based on your academic background and aptitude, {career_data['career']} is a strong match for you."
    }
