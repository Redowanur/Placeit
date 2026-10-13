from datetime import datetime, timezone
from typing import Annotated

from beanie import Document, Indexed, Replace, Save, SaveChanges, Update, before_event
from pydantic import BaseModel, EmailStr, Field, HttpUrl

from enums.user_enums import UserType
from enums.student_enums import PlacementStatus

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class Recruiter(Document):
    name: str = Field(min_length=2, max_length=100)
    email: Annotated[EmailStr, Indexed(unique=True)]
    password_hash: str
    phone: str
    user_type: UserType = UserType.RECRUITER
    company_name: str = Field(min_length=2, max_length=100)
    designation: str = Field(min_length=2, max_length=100)
    linkedin_url: HttpUrl | None = None
    is_verified: bool = False

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    @before_event(Save, Replace, SaveChanges, Update)
    def touch_updated_at(self):
        self.updated_at = utcnow()

    class Settings:
        name = "recruiters"