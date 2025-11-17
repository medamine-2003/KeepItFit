from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    age: int | None = None
    weight: int | None = None
    height: int | None = None
    goal: str | None = None
    diet: str | None = None
    activity_level: str | None = None
    health_conditions: str | None = None


class UserProfileUpdate(BaseModel):
    age: int | None = None
    weight: int | None = None
    height: int | None = None
    goal: str | None = None
    diet: str | None = None
    activity_level: str | None = None
    health_conditions: str | None = None
    profile_picture: str | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    age: int | None = None
    weight: int | None = None
    height: int | None = None
    goal: str | None = None
    diet: str | None = None
    activity_level: str | None = None
    health_conditions: str | None = None
    profile_picture: str | None = None

    class Config:
        from_attributes = True
