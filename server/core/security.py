import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
EMAIL_VERIFICATION_EXPIRE_HOURS = 48

ACCESS_TOKEN_PURPOSE = "access"
EMAIL_VERIFICATION_PURPOSE = "email_verification"

_password_hash = PasswordHash.recommended()  # argon2
# used to burn the same time when the email doesn't exist
DUMMY_HASH = _password_hash.hash("dummy-password")


def hash_password(password: str) -> str:
    return _password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _password_hash.verify(plain_password, hashed_password)


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "purpose": ACCESS_TOKEN_PURPOSE,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_email_verification_token(subject: str) -> str:
    """Long-lived signed link token: contains the user id, expires in 48 hours."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "purpose": EMAIL_VERIFICATION_PURPOSE,
        "iat": now,
        "exp": now + timedelta(hours=EMAIL_VERIFICATION_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str, expected_purpose: str) -> dict:
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if decoded.get("purpose") != expected_purpose:
        # a token minted for a different purpose (e.g. access token used as link token)
        raise jwt.InvalidTokenError("invalid token purpose")
    return decoded


def decode_access_token(token: str) -> dict:
    # raises jwt.InvalidTokenError (including expiry) on any problem
    return decode_token(token, ACCESS_TOKEN_PURPOSE)