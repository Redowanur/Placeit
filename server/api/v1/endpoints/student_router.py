from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from core.security import hash_password
from models.student_model import Student
from schemas.student_schema import StudentCreate, StudentResponse, StudentUpdate
from core.deps import get_current_user
from enums.user_enums import UserType
from enums.student_enums import PlacementStatus
from models.university_model import University
from models.department_model import Department

router = APIRouter(prefix="/students", tags=["Student Management"])


@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_student(student_data: StudentCreate):
        
    dept = await Department.find_one({"_id": student_data.dept_id, "university_id": student_data.uni_id})
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found for the given university",
        )

    student = Student(
        name=student_data.name,
        email=student_data.email,
        reg_no=student_data.reg_no,
        password_hash=hash_password(student_data.password),
        dept_id=student_data.dept_id,
        phone=student_data.phone,
        user_type=UserType.STUDENT,
        is_verified=False,
        placement_status=PlacementStatus.NOT_PLACED,
    )

    try:
        await student.insert()
    except DuplicateKeyError:
        # two simultaneous requests slipped past the pre-checks
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or registration number is already registered",
        )

    return StudentResponse(
        id=str(student.id),
        name=student.name,
        email=student.email,
        reg_no=student.reg_no,
        dept_id=student.dept_id,
        phone=student.phone,
        user_type=student.user_type.value,
        is_verified= False,
        placement_status=PlacementStatus.NOT_PLACED
    )


@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_student(student_id: PydanticObjectId):
    student = await Student.get(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    return StudentResponse(
        id=str(student.id),
        name=student.name,
        email=student.email,
        reg_no=student.reg_no,
        dept_id=student.dept_id,
        phone=student.phone,
        user_type=student.user_type.value,
        is_verified=student.is_verified,
        placement_status=student.placement_status.value,
    )


@router.patch(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
)
async def update_student(
    student_id: PydanticObjectId,
    student_data: StudentUpdate,
    current_user: Student = Depends(get_current_user),
):
    is_self = current_user.id == student_id
    is_admin = current_user.user_type in (UserType.ADMIN, UserType.SUPERADMIN)

    if not (is_self or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own account",
        )

    student = current_user if is_self else await Student.get(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    for field, value in student_data.model_dump(exclude_none=True).items():
        setattr(student, field, value)

    try:
        await student.save()
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or registration number is already registered",
        )

    return StudentResponse(
        id=str(student.id),
        name=student.name,
        email=student.email,
        reg_no=student.reg_no,
        dept_id=student.dept_id,
        phone=student.phone,
        user_type=student.user_type.value,
    )
