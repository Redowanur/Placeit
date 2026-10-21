from fastapi import APIRouter, HTTPException, Query

from models.company_model import Company


router = APIRouter(prefix="/company", tags=["Company Management"])

@router.post(
    "",
    status_code=201,
)
async def create_company(
    name: str = Query(..., min_length=5, max_length=100)
):
    company = Company(name=name)
    
    try:
        await company.insert()
    except Exception as e:
        raise HTTPException(
            status_code=409,
            detail=str('Company with this name already exists')
        )
        
    return {
        "message": "Company created successfully",
        "data": {
            "company_id": str(company.id),
            "company_name": company.name
        }
    }
    
@router.get("",
    status_code=200,
)
async def get_companies():
    companies = await Company.find_all().to_list()
    
    return {
        "message": "Companies retrieved successfully",
        "data": [
            {
                "company_id": str(company.id),
                "company_name": company.name
            } for company in companies
        ]
    }