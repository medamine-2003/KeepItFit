from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    age: int | None = None
    weight: int | None = None
    height: int | None = None
    goal: str | None = None
    diet: str | None = None
    activity_level: str | None = None
    health_conditions: str | None = None


class TokenData(BaseModel):
    username: str | None = None
    email: str | None = None
