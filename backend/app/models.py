# backend/app/models.py
# File path: backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    goal = Column(String, nullable=True)
    diet = Column(String, nullable=True)
    activity_level = Column(String, nullable=True)
    health_conditions = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # URL to profile picture

    activities = relationship("Activity", back_populates="owner", cascade="all, delete-orphan")
    meal_analyses = relationship("MealAnalysis", back_populates="owner", cascade="all, delete-orphan")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    activity = Column(String, index=True, nullable=False)
    duration = Column(Integer, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="activities")


class MealAnalysis(Base):
    __tablename__ = "meal_analyses"

    id = Column(Integer, primary_key=True, index=True)
    image_uri = Column(String, nullable=True)
    analysis_data = Column(JSON, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="meal_analyses")
