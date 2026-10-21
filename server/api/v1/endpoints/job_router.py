from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from core.deps import get_current_user
from enums.job_enums import JobType, WorkPlace
from enums.user_enums import UserType
from models.job_model import Job
from models.recruiter_model import Recruiter


router = APIRouter(prefix="/job", tags=["Job Management"])


class JobCreateRequest(BaseModel):
    title: str
    company_name: str
    job_type: JobType
    experience: str
    salary: str
    office_hours: str
    work_place: WorkPlace
    vacancy: int
    location: str
    description: str
    responsibilities: list[str]
    requirements: list[str]
    skills: list[str]
    benefits: list[str]


@router.post(
    "",
    status_code=201,
)
async def create_job(job: JobCreateRequest, user: Recruiter = Depends(get_current_user)):
    # Check if the current user is a recruiter
    if user.user_type != UserType.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can create jobs",
        )

    new_job = Job(
        **job.model_dump(),
        created_by=user.email
    )
    await new_job.insert()
    return {"message": "Job created successfully", "job_id": str(new_job.id)}
