from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.schemas import QuestionSchema
from app.db.database import get_db
from app.models.domain import Question

router = APIRouter()

@router.get("/", response_model=List[QuestionSchema])
def get_questions(db: Session = Depends(get_db)):
    """
    Get the list of questions for the career guidance test from the database.
    Only returns id and text to frontend to keep scoring weights hidden in the backend.
    """
    questions = db.query(Question).all()
    return [QuestionSchema(id=q.id, text=q.text) for q in questions]
