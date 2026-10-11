from beanie import init_beanie
from pymongo import AsyncMongoClient

from models.student_model import Student
from models.university_model import University
from models.department_model import Department
from models.company_model import Company
from models.recruiter_model import Recruiter

client: AsyncMongoClient | None = None


async def init_db():
    global client

    client = AsyncMongoClient("mongodb://localhost:27018")

    await init_beanie(
        database=client["placement_portal"],
        document_models=[Student, University, Department, Company, Recruiter],
    )


async def close_db():
    if client is not None:
        await client.close()