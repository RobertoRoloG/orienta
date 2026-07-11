from app.db.database import SessionLocal
from app.models.domain import Career

db = SessionLocal()
db.query(Career).update({'market_data_updated_at': None})
db.commit()
print("Cleared market data cache")
