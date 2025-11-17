from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class MealAnalysisCreate(BaseModel):
    image_uri: Optional[str] = None
    analysis: dict

class MealAnalysisResponse(BaseModel):
    id: int
    image_uri: Optional[str]
    analysis_data: dict
    date: datetime
    owner_id: int

    class Config:
        from_attributes = True
