from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.schemas import CareerSchema, CareerCreate, CareerUpdate
from app.db.database import get_db
from app.models.domain import Career, User
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[CareerSchema])
def get_careers(db: Session = Depends(get_db)):
    """ Get all careers. """
    return db.query(Career).all()

from app.services.market_data import update_career_market_data_if_needed

@router.get("/{c_id}", response_model=CareerSchema)
def get_career_by_id(c_id: int, db: Session = Depends(get_db)):
    """ 
    Get a single career by ID. 
    This will trigger an automatic market data update if the data is stale or missing.
    """
    c = db.query(Career).filter(Career.id == c_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
        
    c = update_career_market_data_if_needed(c, db)
    return c

@router.post("/", response_model=CareerSchema, status_code=201)
def create_career(
    payload: CareerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    # Check if name exists
    if db.query(Career).filter(Career.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Ya existe una carrera con ese nombre")
        
    new_c = Career(**payload.model_dump())
    db.add(new_c)
    db.commit()
    db.refresh(new_c)
    return new_c

@router.put("/{c_id}", response_model=CareerSchema)
def update_career(
    c_id: int,
    payload: CareerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    c = db.query(Career).filter(Career.id == c_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
    
    update_data = payload.model_dump(exclude_unset=True)
    
    if "name" in update_data and update_data["name"] != c.name:
        if db.query(Career).filter(Career.name == update_data["name"]).first():
            raise HTTPException(status_code=400, detail="Ya existe una carrera con ese nombre")
            
    for key, value in update_data.items():
        setattr(c, key, value)
        
    db.commit()
    db.refresh(c)
    return c

@router.delete("/{c_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_career(
    c_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    c = db.query(Career).filter(Career.id == c_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
        
    db.delete(c)
    db.commit()
    return None
