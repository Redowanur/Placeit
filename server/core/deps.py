import jwt
from beanie import PydanticObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.security import decode_access_token
from models.user_model import User, UserType

bearer_scheme = HTTPBearer()

_credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired token",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> User:
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = PydanticObjectId(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, InvalidId):
        raise _credentials_error

    user = await User.get(user_id)
    if user is None:
        raise _credentials_error
    return user


def require_roles(*roles: UserType):
    async def checker(user: User = Depends(get_current_user)) -> User:
        if user.user_type not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to do this",
            )
        return user

    return checker