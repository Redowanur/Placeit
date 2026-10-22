from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, Field

from enums.job_enums import JobType, WorkPlace


class JobListProjection(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: PydanticObjectId = Field(validation_alias="_id")
    title: str
    company_name: str
    job_type: JobType
    experience: str
    salary: str
    office_hours: str
    work_place: WorkPlace
    vacancy: int
    location: str


class JobCreateRequest(BaseModel):
    title: str
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
    
class JobUpdateRequest(BaseModel):
    title: str | None = None
    job_type: JobType | None = None
    experience: str | None = None
    salary: str | None = None
    office_hours: str | None = None
    work_place: WorkPlace | None = None
    vacancy: int | None = None
    location: str | None = None
    description: str | None = None
    responsibilities: list[str] | None = None
    requirements: list[str] | None = None
    skills: list[str] | None = None
    benefits: list[str] | None = None