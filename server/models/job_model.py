from datetime import datetime

from beanie import Document, PydanticObjectId
from pydantic import EmailStr, Field

from enums.job_enums import JobType, WorkPlace
from utils.helpers import utcnow

class Job(Document):
    title: str = Field(min_length=5, max_length=50)
    company_name: str = Field(min_length=5, max_length=50)
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
    created_by: EmailStr
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    
    class Settings:
        name = "jobs"