import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.db.database import engine
from app.models.domain import Base, ContactMessage

print("Creating contact_messages table if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")
