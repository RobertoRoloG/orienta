from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.domain import Subject, Career
from app.models.schemas import SubjectSchema

router = APIRouter()

@router.get("/subjects", response_model=List[SubjectSchema])
def get_subjects(db: Session = Depends(get_db)):
    """
    Returns the list of available high school subjects for grading.
    """
    subjects = db.query(Subject).all()
    return subjects

@router.get("/tags", response_model=List[str])
def get_tags(db: Session = Depends(get_db)):
    """
    Returns the unique list of career tags/tastes.
    """
    careers = db.query(Career).all()
    unique_tags = set()
    for c in careers:
        if c.tags:
            for tag in c.tags:
                unique_tags.add(tag)
    return sorted(list(unique_tags))
