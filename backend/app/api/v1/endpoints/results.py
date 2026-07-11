from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api import deps
from app.models.domain import User, TestResult
from app.models.schemas import TestResultCreate, TestResultRead

router = APIRouter()

@router.post("/", response_model=TestResultRead, status_code=201)
def save_test_result(
    payload: TestResultCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    Save a new test result for the logged in user.
    """
    new_result = TestResult(
        user_id=current_user.id,
        dimension_scores=payload.dimension_scores.model_dump(),
        tastes=payload.tastes,
        grades=[g.model_dump() for g in payload.grades] if payload.grades else None,
        top_careers=[c.model_dump() for c in payload.top_careers]
    )
    
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result

@router.get("/", response_model=List[TestResultRead])
def get_user_results(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    Get all test results for the logged in user, ordered by newest first.
    """
    results = db.query(TestResult).filter(TestResult.user_id == current_user.id).order_by(desc(TestResult.created_at)).all()
    return results
