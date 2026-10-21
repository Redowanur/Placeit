from fastapi import APIRouter, Depends, HTTPException, status

from core.deps import get_current_user
from enums.user_enums import UserType
from models.job_model import Job
from models.recruiter_model import Recruiter
from schemas.job_schema import JobCreateRequest, JobUpdateRequest
from utils.helpers import utcnow


router = APIRouter(prefix="/job", tags=["Job Management"])


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
        company_name=user.company_name,
        created_by=user.email
    )
    await new_job.insert()
    return {"message": "Job created successfully", "job_id": str(new_job.id)}


@router.delete(
    "/{job_id}",
    status_code=200,
)
async def delete_job(job_id: str, user: Recruiter = Depends(get_current_user)):
    # Check if the current user is a recruiter
    if user.user_type != UserType.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can delete jobs",
        )

    job = await Job.get(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # Check if the job was created by the current recruiter
    if job.created_by != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete jobs you created",
        )

    await job.delete()
    return {"message": "Job deleted successfully"}


@router.patch(
    "/{job_id}",
    status_code=200,
)
async def update_job(job_id: str, job_data: JobUpdateRequest, user: Recruiter = Depends(get_current_user)):
    # Check if the current user is a recruiter
    if user.user_type != UserType.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can update jobs",
        )

    job = await Job.get(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # Check if the job was created by the current recruiter
    if job.created_by != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update jobs you created",
        )

    # Update only the fields that were actually sent in the request
    for field, value in job_data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    job.updated_at = utcnow()

    await job.save()
    return {"message": "Job updated successfully", "job_id": str(job.id)}

@router.get(
    "/{job_id}",
    status_code=200,
)
async def get_job(job_id: str):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )
    return job