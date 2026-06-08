from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.schemas import AnswerSubmitSchema, UserProfileSchema
from app.services.scoring import calculate_profile
from app.db.database import get_db
from app.models.domain import Question

router = APIRouter()

@router.post("/", response_model=UserProfileSchema)
def compute_score(payload: AnswerSubmitSchema, db: Session = Depends(get_db)):
    """
    Evaluates test answers, calculates scoring dimensions,
    and returns the final UserProfile.
    """
    questions = db.query(Question).all()
    # Convert SQLAlchemy models to dicts for the service
    q_dicts = [{"id": q.id, "dimensions": q.dimensions, "weight": q.weight} for q in questions]
    
    profile = calculate_profile(payload.answers, q_dicts)
    return UserProfileSchema(**profile)
