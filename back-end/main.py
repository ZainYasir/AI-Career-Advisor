from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routes import auth, quiz, recommendations

app = FastAPI(title="AI Career Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])


@app.get("/")
def root():
    return {"status": "Backend running"}
