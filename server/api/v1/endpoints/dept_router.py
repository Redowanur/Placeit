from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Query

from models.department_model import Department
from models.university_model import University


router = APIRouter(prefix="/departments", tags=["Department Management"])

@router.post(
    "",
    status_code=201,
)
async def create_department(
    department_name: str = Query(..., min_length=2, max_length=100),
    university_id: PydanticObjectId = Query(...)
):
    uni = await University.find_one({"_id": university_id})
    
    if not uni:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )
    
    dept = await Department.find_one({"name": department_name, "university_id": university_id})
    
    if dept:
        raise HTTPException(
            status_code=409,
            detail="Department already exists for this university"
        )

    department = Department(
        name=department_name,
        university_id=university_id
    )
    
    try:
        await department.insert()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
    return {
        "message": "Department created successfully",
        "data": {
            "department_id": str(department.id),
            "department_name": department.name,
            "university_name": uni.name
        }
    }
    
@router.get(
    "",
    status_code=200,
)
async def get_departments():
    departments = await Department.find_all().to_list()
    
    department_list=[]
    
    for department in departments:
        university = await University.find_one({"_id": department.university_id})
        
        if university:
            department_list.append({
                "department_id": str(department.id),
                "department_name": department.name,
                "university_name": university.name
            })
    
    return department_list