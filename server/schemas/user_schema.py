from pydantic import BaseModel, EmailStr, Field, field_validator

from models.user_model import ALLOWED_EMAIL_DOMAINS


def _check_email(value: str | None) -> str | None:
    if value is None:
        return value
    value = value.lower()
    if value.split("@")[-1] not in ALLOWED_EMAIL_DOMAINS:
        raise ValueError("Use your university email address.")
    return value


def _check_phone(value: str | None) -> str | None:
    if value is None:
        return value
    if not value.isdigit() or len(value) != 10:
        raise ValueError("Invalid phone number.")
    return "+880" + value


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    reg_no: int = Field(gt=0)
    password: str = Field(min_length=8)
    dept_id: int = Field(gt=0)
    phone: str

    _email = field_validator("email")(classmethod(lambda cls, v: _check_email(v)))
    _phone = field_validator("phone")(classmethod(lambda cls, v: _check_phone(v)))


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    reg_no: int | None = Field(default=None, gt=0)
    dept_id: int | None = Field(default=None, gt=0)
    phone: str | None = None

    _email = field_validator("email")(classmethod(lambda cls, v: _check_email(v)))
    _phone = field_validator("phone")(classmethod(lambda cls, v: _check_phone(v)))


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    reg_no: int
    dept_id: int
    phone: str
    user_type: str