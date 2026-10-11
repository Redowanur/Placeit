from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from core.security import hash_password
from models.user_model import User, UserType
from schemas.user_schema import UserCreate, UserResponse, UserUpdate
from core.deps import get_current_user

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
    
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def get_user(user_id: str):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
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


@router.patch(
    "/users/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def update_user(
    user_id: PydanticObjectId,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
):
    is_self = current_user.id == user_id
    is_admin = current_user.user_type in (UserType.ADMIN, UserType.SUPERADMIN)

    if not (is_self or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own account",
        )

    user = current_user if is_self else await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    for field, value in user_data.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    try:
        await user.save()
    except DuplicateKeyError:
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