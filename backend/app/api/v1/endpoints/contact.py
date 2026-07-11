from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.domain import ContactMessage
from app.models.schemas import ContactMessageCreate, ContactMessageRead, ContactMessageUpdate
from app.api.deps import get_current_admin

router = APIRouter()

@router.post("/", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
def submit_contact_message(message_in: ContactMessageCreate, db: Session = Depends(get_db)):
    db_message = ContactMessage(
        first_name=message_in.first_name,
        last_name=message_in.last_name,
        email=message_in.email,
        message=message_in.message
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/", response_model=List[ContactMessageRead])
def get_contact_messages(db: Session = Depends(get_db), current_user = Depends(get_current_admin)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return messages

@router.put("/{message_id}", response_model=ContactMessageRead)
def update_contact_message(message_id: int, message_update: ContactMessageUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_admin)):
    db_message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    
    db_message.is_read = message_update.is_read
    db.commit()
    db.refresh(db_message)
    return db_message
