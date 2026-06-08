from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.schemas import MatchingRequestSchema, RankedCareerSchema
from app.services.matching import rank_careers
from app.db.database import get_db
from app.models.domain import Career

router = APIRouter()

@router.post("/", response_model=List[RankedCareerSchema])
def get_matching_careers(payload: MatchingRequestSchema, db: Session = Depends(get_db)):
    """
    Compares the user test profile, optional tastes, and optional grades
    with all careers and returns them sorted by compatibility.
    """
    user_profile_dict = payload.profile.model_dump()
    careers = db.query(Career).all()
    
    career_dicts = []
    for c in careers:
        # Extract the JSON profile and add the career name back into the dict for the algorithm
        c_dict = c.dimension_profile.copy()
        c_dict["name"] = c.name
        c_dict["tags"] = c.tags
        c_dict["academic_weights"] = c.academic_weights
        career_dicts.append(c_dict)
        
    ranked = rank_careers(
        user_profile_dict, 
        career_dicts,
        user_tastes=payload.tastes,
        user_grades=[g.model_dump() for g in payload.grades] if payload.grades else None
    )
    return [RankedCareerSchema(**r) for r in ranked]
