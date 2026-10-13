from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator

from enums.student_enums import PlacementStatus
from enums.user_enums import UserType
from utils.field_validators import _check_email, _check_phone


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