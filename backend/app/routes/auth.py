# backend/app/routes/auth.py
# File path: backend/app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, Token, UserProfileUpdate, UserResponse
from app.database import get_db
from app.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from dotenv import load_dotenv
from minio import Minio
import os
import io

load_dotenv()

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30

# MinIO configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET")
MINIO_PUBLIC_ENDPOINT = os.getenv("MINIO_PUBLIC_ENDPOINT")

if all([MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET]):
    minio_client = Minio(
        str(MINIO_ENDPOINT),
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )
    if not minio_client.bucket_exists(MINIO_BUCKET):
        minio_client.make_bucket(MINIO_BUCKET)
else:
    minio_client = None

@router.post("/register", response_model=Token)  # ← FIXED
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        age=user.age,
        weight=user.weight,
        height=user.height,
        goal=user.goal,
        diet=user.diet,
        activity_level=user.activity_level,
        health_conditions=user.health_conditions
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "age": db_user.age,
        "weight": db_user.weight,
        "height": db_user.height,
        "goal": db_user.goal,
        "diet": db_user.diet,
        "activity_level": db_user.activity_level,
        "health_conditions": db_user.health_conditions
    }

@router.post("/login", response_model=Token)
async def login_for_access_token(
    credentials: dict,
    db: Session = Depends(get_db)
):
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "age": user.age,
        "weight": user.weight,
        "height": user.height,
        "goal": user.goal,
        "diet": user.diet,
        "activity_level": user.activity_level,
        "health_conditions": user.health_conditions
    }

@router.post("/update-profile", response_model=UserResponse)
async def update_user_profile(
    profile: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in profile.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not minio_client:
        raise HTTPException(status_code=500, detail="Storage service not configured")
    
    try:
        content = await file.read()
        buffer = io.BytesIO(content)
        object_name = f"profile_{current_user.id}_{file.filename}"
        
        minio_client.put_object(
            str(MINIO_BUCKET),
            object_name,
            buffer,
            length=len(content),
            content_type=file.content_type or "image/jpeg"
        )
        
        public_endpoint = MINIO_PUBLIC_ENDPOINT or MINIO_ENDPOINT
        url = f"http://{public_endpoint}/{MINIO_BUCKET}/{object_name}"
        
        # Update user profile
        current_user.profile_picture = url
        db.commit()
        db.refresh(current_user)
        
        return {"profile_picture": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
