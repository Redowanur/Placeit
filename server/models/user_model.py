from datetime import datetime, timezone
from enum import Enum
from typing import Annotated

from beanie import Document, Indexed, Replace, SaveChanges, Update, before_event
from pydantic import BaseModel, EmailStr, Field

ALLOWED_EMAIL_DOMAINS = {"student.sust.edu"}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserType(str, Enum):
    STUDENT = "student"
    COORDINATOR = "coordinator"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"


class PlacementStatus(str, Enum):
    NOT_APPLIED = "not_applied"
    APPLIED = "applied"
    WRITTEN_TEST = "written_test"
    INTERVIEW = "interview"
    PLACED = "placed"
    NOT_PLACED = "not_placed"


class CompanyApplication(BaseModel):  # embedded in User, not its own collection
    company_id: str
    status: PlacementStatus = PlacementStatus.APPLIED
    applied_at: datetime = Field(default_factory=utcnow)


class User(Document):
    name: str = Field(min_length=2, max_length=100)
    email: Annotated[EmailStr, Indexed(unique=True)]
    reg_no: Annotated[int, Indexed(unique=True)] = Field(gt=0)
    password_hash: str
    dept_id: int = Field(gt=0)
    phone: str
    user_type: UserType = UserType.STUDENT
    is_verified: bool = False

    applied_companies_with_status: list[CompanyApplication] = Field(
        default_factory=list
    )

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    @before_event(Replace, SaveChanges, Update)
    def touch_updated_at(self):
        self.updated_at = utcnow()

    class Settings:
        name = "users"