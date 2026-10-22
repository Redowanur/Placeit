import re

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import EmailStr

from core.deps import get_current_user
from enums.job_enums import JobType, WorkPlace
from enums.user_enums import UserType
from models.job_model import Job
from models.recruiter_model import Recruiter
from schemas.job_schema import JobCreateRequest, JobListProjection, JobUpdateRequest
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
    "/all-jobs",
    status_code=200,
)
async def list_jobs(
    company_name: str | None = Query(None, description="Filter by company name (partial, case-insensitive)"),
    job_type: JobType | None = Query(None, description="Filter by job type"),
    work_place: WorkPlace | None = Query(None, description="Filter by work place"),
    created_by: EmailStr | None = Query(None, description="Filter by recruiter email"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Number of jobs per page"),
):
    # Build the filter conditions based on provided query params
    filters = []
    if company_name:
        filters.append({"company_name": {"$regex": re.escape(company_name), "$options": "i"}})
    if job_type:
        filters.append(Job.job_type == job_type)
    if work_place:
        filters.append(Job.work_place == work_place)
    if created_by:
        filters.append(Job.created_by == created_by)

    query = Job.find(*filters, projection_model=JobListProjection)
    total_jobs = await query.count()

    jobs = await query.skip((page - 1) * limit).limit(limit).to_list()
    total_pages = (total_jobs + limit - 1) // limit

    return {
        "total_jobs": total_jobs,
        "total_pages": total_pages,
        "current_page": page,
        "jobs": jobs,
    }


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