from fastapi import APIRouter

from api.v1.endpoints import (
    auth_router,
    student_router,
    dept_router,
    university_router,
    recruiter_router,
    company_router,
)

api_router = APIRouter()

api_router.include_router(auth_router.router)
api_router.include_router(student_router.router)
api_router.include_router(recruiter_router.router)
api_router.include_router(dept_router.router)
api_router.include_router(university_router.router)
api_router.include_router(company_router.router)