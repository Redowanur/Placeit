import jwt
from beanie import PydanticObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordBearer

from core.security import decode_access_token
from models.student_model import Student, UserType
from models.recruiter_model import Recruiter
from typing import Union

bearer_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

_credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired token",
    headers={"WWW-Authenticate": "Bearer"},
)



async def get_current_user(
    token: str = Depends(bearer_scheme),
) -> Union[Student, Recruiter]:
    try:
        payload = decode_access_token(token)
        user_id = PydanticObjectId(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, InvalidId):
        raise _credentials_error

    student = await Student.get(user_id)
    if student is not None:
        return student

    recruiter = await Recruiter.get(user_id)
    if recruiter is not None:
        return recruiter

    raise _credentials_error


def require_roles(*roles: UserType):
    async def checker(student: Student = Depends(get_current_user)) -> Student:
        if student.user_type not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to do this",
            )
        return student

    return checker