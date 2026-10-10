from fastapi import APIRouter

from api.v1.endpoints import user_router, auth_router

api_router = APIRouter()

api_router.include_router(user_router.router, prefix="/api/v1", tags=["User Management"])
api_router.include_router(auth_router.router, prefix="/api/v1", tags=["Authentication"])