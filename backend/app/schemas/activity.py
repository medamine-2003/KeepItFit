from pydantic import BaseModel
from datetime import datetime


class ActivityBase(BaseModel):
    activity: str
    duration: int


class ActivityCreate(ActivityBase):
    pass


class ActivityResponse(ActivityBase):
    id: int
    owner_id: int
    date: datetime

    model_config = {
        "from_attributes": True
    }
