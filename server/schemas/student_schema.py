from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator

from enums.student_enums import ALLOWED_STUDENT_EMAIL_DOMAINS, PlacementStatus
from enums.user_enums import UserType

def _check_email(value: str | None) -> str | None:
    if value is None:
        return value
    value = value.lower()
    if value.split("@")[-1] not in ALLOWED_STUDENT_EMAIL_DOMAINS:
        raise ValueError("Use your university email address.")
    return value


def _check_phone(value: str | None) -> str | None:
    if value is None:
        return value
    if not value.isdigit() or len(value) != 10:
        raise ValueError("Invalid phone number.")
    return "+880" + value


class StudentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    reg_no: int = Field(gt=0)
    password: str = Field(min_length=8)
    dept_id: PydanticObjectId
    uni_id: PydanticObjectId
    phone: str

    _email = field_validator("email")(classmethod(lambda cls, v: _check_email(v)))
    _phone = field_validator("phone")(classmethod(lambda cls, v: _check_phone(v)))


class StudentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    phone: str | None = None
    placement_status: PlacementStatus | None = None

    _phone = field_validator("phone")(classmethod(lambda cls, v: _check_phone(v)))


class StudentResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    reg_no: int
    dept_id: PydanticObjectId
    phone: str
    user_type: UserType
    is_verified: bool
    placement_status: PlacementStatus