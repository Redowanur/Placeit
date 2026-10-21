from fastapi import HTTPException, status

from core.security import DUMMY_HASH, verify_password
from models.recruiter_model import Recruiter
from models.student_model import Student


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