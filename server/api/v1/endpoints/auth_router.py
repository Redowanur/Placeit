from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from core.security import (
    DUMMY_HASH,
    create_access_token,
    verify_password,
)
from models.student_model import Student
from schemas.auth import LoginRequest, TokenResponse
from schemas.student_schema import StudentResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user = await Student.find_one(Student.email == data.email)

    if user is None:
        verify_password(data.password, DUMMY_HASH)  # keep timing similar
        raise invalid

    if not verify_password(data.password, user.password_hash):
        raise invalid

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user_type=user.user_type.value
    )


@router.get("/me", response_model=StudentResponse)
async def me(current_user: Student = Depends(get_current_user)):
    return StudentResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        reg_no=current_user.reg_no,
        dept_id=current_user.dept_id,
        phone=current_user.phone,
        user_type=current_user.user_type.value,
    )