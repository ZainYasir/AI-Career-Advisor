import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import joblib
import random
from pathlib import Path

# Paths
DATASET_FILE = Path("ml/dataset.csv")
MODEL_FILE = Path("ml/model.pkl")

# Quiz questions: 15 questions, each answer 0-3
NUM_QUESTIONS = 15
NUM_SAMPLES = 200  # number of dummy users

# Career mapping
career_map = {0: "tech", 1: "medical", 2: "business", 3: "arts"}

# Function to randomly assign career tag based on plausible answers
def generate_sample():
    answers = []
    # Generate answers
    for i in range(NUM_QUESTIONS):
        # First 3 questions are strongly indicative of career
        if i < 3:
            career = random.choice([0,1,2,3])
            answers.append(career)
        else:
            # Mix answers randomly to simulate variation
            answers.append(random.randint(0,3))
    # Target career: most frequent value in first 3 questions
    target = max(set(answers[:3]), key=answers[:3].count)
    return answers, target

# Generate dataset
X = []
y = []
for _ in range(NUM_SAMPLES):
    answers, target = generate_sample()
    X.append(answers)
    y.append(target)

# Create DataFrame
df = pd.DataFrame(X, columns=[f"Q{i+1}" for i in range(NUM_QUESTIONS)])
df["target"] = y

# Save dataset
DATASET_FILE.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(DATASET_FILE, index=False)
print(f"Dataset saved at {DATASET_FILE}")

# Train DecisionTreeClassifier
clf = DecisionTreeClassifier()
clf.fit(df.iloc[:, :-1], df["target"])
joblib.dump(clf, MODEL_FILE)
print(f"ML model trained and saved at {MODEL_FILE}")
