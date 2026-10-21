from fastapi import APIRouter, HTTPException, status

from schemas.recruiter_schema import RecruiterCreateRequest, RecruiterCreateResponse
from enums.user_enums import UserType
from models.recruiter_model import Recruiter
from models.company_model import Company
from core.security import hash_password

router = APIRouter(prefix="/recruiter", tags=["Recruiter Management"])

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_recruiter(recruiter_data: RecruiterCreateRequest) -> RecruiterCreateResponse:
    
    company = await Company.find_one({"name": recruiter_data.company_name})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )
    
    recruiter = Recruiter(
        name=recruiter_data.name,
        email=recruiter_data.email,
        password_hash=hash_password(recruiter_data.password),
        phone=recruiter_data.phone,
        user_type=UserType.RECRUITER,
        company_name=recruiter_data.company_name,
        designation=recruiter_data.designation,
        is_verified=False,
    )
    
    try:
        await recruiter.insert()
    except Exception as e:
        # Handle duplicate key error for email
        if "duplicate key error" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred",
            )
            
    return RecruiterCreateResponse(
        id=str(recruiter.id),
        name=recruiter.name,
        email=recruiter.email,
        phone=recruiter.phone,
        user_type=recruiter.user_type.value,
        company_name=recruiter.company_name,
        designation=recruiter.designation,
        is_verified=recruiter.is_verified,
    )