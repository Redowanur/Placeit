from pydantic import BaseModel, EmailStr, Field, field_validator

from models.user_model import ALLOWED_EMAIL_DOMAINS


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    reg_no: int = Field(gt=0)
    password: str = Field(min_length=8)
    dept_id: int = Field(gt=0)
    phone: str

    @field_validator("email")
    @classmethod
    def validate_student_email(cls, value: str) -> str:
        value = value.lower()
        if value.split("@")[-1] not in ALLOWED_EMAIL_DOMAINS:
            raise ValueError("Use your university email address.")
        return value
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not value.isdigit() or len(value) != 10:
            raise ValueError("Invalid phone number.")
        return '+880'+value


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    reg_no: int
    dept_id: int
    phone: str
    user_type: str