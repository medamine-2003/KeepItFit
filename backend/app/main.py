# backend/app/main.py
# File path: backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routes import auth, upload, plan, activity, chat
from app.database import engine, Base
from dotenv import load_dotenv

load_dotenv()

# create all tables from Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TechHeal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(plan.router, prefix="/plan", tags=["Plan"])
app.include_router(activity.router, prefix="/activity", tags=["Activity"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Welcome to TechHeal API"}
