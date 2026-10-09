from pydantic import BaseModel, EmailStr, Field, field_validator

from models.users import ALLOWED_EMAIL_DOMAINS


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
            raise ValueError("Use your student.sust.edu email address")
        return value


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    reg_no: int
    dept_id: int
    phone: str
    user_type: str