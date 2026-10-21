from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from core.security import (
    DUMMY_HASH,
    create_access_token,
    verify_password,
)
from enums.user_enums import UserType
from models.recruiter_model import Recruiter
from models.student_model import Student
from schemas.auth import LoginRequest, TokenResponse
from schemas.recruiter_schema import RecruiterCreateResponse
from schemas.student_schema import StudentResponse
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Authentication"])

MeResponse = StudentResponse | RecruiterCreateResponse

async def authenticate(email: str, password: str) -> Student | Recruiter:
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user = await Student.find_one(Student.email == email)
    if user is None:
        user = await Recruiter.find_one(Recruiter.email == email)

    if user is None:
        verify_password(password, DUMMY_HASH)  # keep timing similar
        raise invalid

    if not verify_password(password, user.password_hash):
        raise invalid

    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    user = await authenticate(data.email, data.password)
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user_type=user.user_type,
    )


@router.post("/token", response_model=TokenResponse)
async def token(form: OAuth2PasswordRequestForm = Depends()):
    # Swagger's "username" field carries the email
    user = await authenticate(form.username.strip().lower(), form.password)
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user_type=user.user_type,
    )


@router.get("/me", response_model=MeResponse)
async def me(current_user: Student | Recruiter = Depends(get_current_user)):

    if current_user.user_type == UserType.STUDENT:
        return StudentResponse(
            id=str(current_user.id),
            name=current_user.name,
            email=current_user.email,
            reg_no=current_user.reg_no,
            dept_id=current_user.dept_id,
            phone=current_user.phone,
            user_type=current_user.user_type,
            is_verified=current_user.is_verified,
            placement_status=current_user.placement_status
        )
        
    if current_user.user_type == UserType.RECRUITER:
        return RecruiterCreateResponse(
            id=str(current_user.id),
            name=current_user.name,
            email=current_user.email,
            phone=current_user.phone,
            user_type=current_user.user_type,
            company_name=current_user.company_name,
            designation=current_user.designation,
            is_verified=current_user.is_verified
        )