from datetime import datetime, timezone
from enum import Enum
from typing import Annotated

from beanie import Document, Indexed, PydanticObjectId, Replace, Save, SaveChanges, Update, before_event
from pydantic import BaseModel, EmailStr, Field

from enums.user_enums import UserType
from enums.student_enums import PlacementStatus

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class Student(Document):
    name: str = Field(min_length=2, max_length=100)
    email: Annotated[EmailStr, Indexed(unique=True)]
    reg_no: Annotated[int, Indexed(unique=True)] = Field(gt=0)
    password_hash: str
    dept_id: PydanticObjectId
    phone: str
    user_type: UserType = UserType.STUDENT
    is_verified: bool = False
    placement_status: PlacementStatus = PlacementStatus.NOT_PLACED

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    @before_event(Save, Replace, SaveChanges, Update)
    def touch_updated_at(self):
        self.updated_at = utcnow()

    class Settings:
        name = "students"