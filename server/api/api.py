from fastapi import APIRouter

from api.v1.endpoints import auth_router, student_router, dept_router, university_router

api_router = APIRouter()

api_router.include_router(auth_router.router, tags=["Authentication"])
api_router.include_router(student_router.router, tags=["User Management"])
api_router.include_router(dept_router.router, tags=["Department Management"])
api_router.include_router(university_router.router, tags=["University Management"])