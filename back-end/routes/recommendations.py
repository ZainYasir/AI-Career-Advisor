from fastapi import APIRouter, HTTPException, Query
import json
from pathlib import Path
import joblib
import importlib.util
import sys

router = APIRouter()

# Base directory of your backend
BASE_DIR = Path(__file__).resolve().parent.parent

# File paths
UNIVERSITY_FILE = BASE_DIR / "data" / "universities.json"
RESULT_FILE = BASE_DIR / "data" / "result.json"
MODEL_FILE = BASE_DIR / "ml" / "model.pkl"
NLP_FILE = BASE_DIR / "ml" / "nlp.py"

# ================= Load NLP module dynamically =================
spec = importlib.util.spec_from_file_location("nlp", NLP_FILE)
nlp = importlib.util.module_from_spec(spec)
sys.modules["nlp"] = nlp
spec.loader.exec_module(nlp)
# ================================================================

# Load JSON data
with open(UNIVERSITY_FILE, "r") as f:
    universities = json.load(f)

# Load ML model
model = joblib.load(MODEL_FILE) if MODEL_FILE.exists() else None

@router.get("/")
def get_recommendation(language: str = Query("en")):
    if not RESULT_FILE.exists():
        raise HTTPException(status_code=400, detail="Quiz not completed")

    with open(RESULT_FILE, "r") as f:
        result = json.load(f)

    career_tag = result.get("career_tag")
    confidence = result.get("confidence", 0.5)

    career_data = universities.get(career_tag)
    if not career_data:
        raise HTTPException(status_code=404, detail="Invalid career tag")

    # ================= NLP Integration =================
    nlp_insight = nlp.get_career_insight(career_tag, language)
    # Only use the plain, user-facing text
    nlp_text = nlp_insight["text"]
    # ====================================================

    # Language-specific explanation
    if language == "ur":
        explanation = (
            f"آپ کی تعلیمی کارکردگی اور صلاحیت کی بنیاد پر، "
            f"{career_data['career']} آپ کے لیے ایک موزوں شعبہ ہے۔"
        )
    else:
        explanation = (
            f"Based on your academic background and aptitude, "
            f"{career_data['career']} is a strong match for you."
        )

    # Combine explanation + NLP plain text
    full_explanation = f"{explanation}\n\n{nlp_text}"

    return {
        "career": career_data["career"],
        "confidence": confidence,
        "degree_programs": career_data["degrees"],
        "universities": career_data["universities"],
        "explanation": full_explanation
    }
