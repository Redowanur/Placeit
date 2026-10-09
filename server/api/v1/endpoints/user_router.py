from fastapi import APIRouter, HTTPException, status
from pymongo.errors import DuplicateKeyError

from core.security import hash_password
from models.users import User, UserType
from schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user_data: UserCreate):
    # Friendly pre-checks (the unique indexes are the real guarantee)
    if await User.find_one(User.email == user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    if await User.find_one(User.reg_no == user_data.reg_no):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration number is already registered",
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
        reg_no=user_data.reg_no,
        password_hash=hash_password(user_data.password),
        dept_id=user_data.dept_id,
        phone=user_data.phone,
        user_type=UserType.STUDENT,  # role is always set server-side
    )

    try:
        await user.insert()
    except DuplicateKeyError:
        # two simultaneous requests slipped past the pre-checks
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or registration number is already registered",
        )

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        reg_no=user.reg_no,
        dept_id=user.dept_id,
        phone=user.phone,
        user_type=user.user_type.value,
    )