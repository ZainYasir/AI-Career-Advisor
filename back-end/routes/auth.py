from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
import json
import os
import uuid

router = APIRouter()

USERS_FILE = "data/users.json"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------- Utilities ----------------

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# ---------------- Routes ----------------

@router.post("/register")
def register(user: dict):
    users = load_users()

    # check duplicate email
    for u in users:
        if u["email"] == user["email"]:
            raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "id": str(uuid.uuid4()),
        "name": user.get("name"),
        "email": user.get("email"),
        "password": hash_password(user.get("password"))
    }

    users.append(new_user)
    save_users(users)

    return {"success": True, "message": "User registered successfully"}


@router.post("/login")
def login(credentials: dict):
    users = load_users()

    for u in users:
        if u["email"] == credentials.get("email"):
            if verify_password(credentials.get("password"), u["password"]):
                return {
                    "success": True,
                    "token": str(uuid.uuid4()),  # demo token
                    "user": {
                        "name": u["name"],
                        "email": u["email"]
                    }
                }

    raise HTTPException(status_code=401, detail="Invalid credentials")
