from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.schemas import QuestionSchema, QuestionReadPublic, QuestionCreate, QuestionUpdate
from app.db.database import get_db
from app.models.domain import Question, User
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[QuestionReadPublic])
def get_public_questions(db: Session = Depends(get_db)):
    """
    Get the list of questions for the test (Public).
    Only returns id and text.
    """
    questions = db.query(Question).all()
    return [QuestionReadPublic(id=q.id, text=q.text) for q in questions]

@router.get("/admin", response_model=List[QuestionSchema])
def get_admin_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    """ Get full questions for admin panel. """
    return db.query(Question).all()

@router.post("/", response_model=QuestionSchema, status_code=201)
def create_question(
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    new_q = Question(**payload.model_dump())
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

@router.put("/{q_id}", response_model=QuestionSchema)
def update_question(
    q_id: int,
    payload: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    q = db.query(Question).filter(Question.id == q_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(q, key, value)
        
    db.commit()
    db.refresh(q)
    return q

@router.delete("/{q_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    q_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    q = db.query(Question).filter(Question.id == q_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
        
    db.delete(q)
    db.commit()
    return None
