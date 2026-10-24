from fastapi import APIRouter, Depends, HTTPException, status
import jwt

from core.deps import get_current_user
from core.security import (
    create_access_token,
    create_email_verification_token,
    decode_token,
    EMAIL_VERIFICATION_PURPOSE,
)
from enums.user_enums import UserType
from models.recruiter_model import Recruiter
from models.student_model import Student
from schemas.auth import LoginRequest, TokenResponse, VerifyEmailRequest
from schemas.recruiter_schema import RecruiterCreateResponse
from schemas.student_schema import StudentResponse
from fastapi.security import OAuth2PasswordRequestForm
from services.auth_service import authenticate
from services.email_service import send_verification_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

MeResponse = StudentResponse | RecruiterCreateResponse


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


@router.post("/send-verification", status_code=status.HTTP_202_ACCEPTED)
async def send_verification(current_user: Student | Recruiter = Depends(get_current_user)):
    """Emails a signed verification link to the logged-in user."""
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account is already verified",
        )

    token = create_email_verification_token(str(current_user.id))
    await send_verification_email(
        current_user.email,
        current_user.name,
        current_user.user_type.value,
        token,
    )
    return {"message": "Verification email sent. Check your inbox."}


@router.post("/verify")
async def verify_email(data: VerifyEmailRequest):
    """Completes verification when the user clicks the emailed link."""
    try:
        payload = decode_token(data.token, EMAIL_VERIFICATION_PURPOSE)
        user_id = payload["sub"]
    except (jwt.InvalidTokenError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link is invalid or has expired. Request a new one.",
        )

    user = await Student.get(user_id) or await Recruiter.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    if not user.is_verified:
        user.is_verified = True
        await user.save()

    return {
        "message": "Your account has been verified successfully",
        "user_type": user.user_type.value,
        "email": user.email,
    }