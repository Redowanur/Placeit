from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Query, status

from models.university_model import University
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.post(
    "/universities",
    status_code=201,
)
async def create_university(
    university_name: str = Query(
        ..., 
        examples="Bangladesh University of Engineering and Technology"
    ),
):
    
    uni = await University.find_one({"name": university_name})
    
    if uni:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="University name is already registered",
        )
    
    university = University(
        name=university_name,
    )

    try:
        await university.insert()
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="University name is already registered",
        )

    return {"message": "University created successfully"}
    
@router.get(
    "/universities",
    status_code=200,
)
async def get_universities():
    universities = await University.find_all().to_list()
    return universities

@router.get(
    "/universities/{university_id}",
    status_code=200,
)
async def get_university(university_id: PydanticObjectId):
    university = await University.find_one({"_id": university_id})
    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )
    return university