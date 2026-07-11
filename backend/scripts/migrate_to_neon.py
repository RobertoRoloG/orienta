import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.models.domain import Base, Career, Question, Subject, User

def migrate():
    # 1. Connect to local SQLite to read data
    sqlite_engine = create_engine("sqlite:///./orienta.db", connect_args={"check_same_thread": False})
    SqliteSession = sessionmaker(bind=sqlite_engine)
    sqlite_db = SqliteSession()

    questions = sqlite_db.query(Question).all()
    careers = sqlite_db.query(Career).all()
    subjects = sqlite_db.query(Subject).all()
    try:
        users = sqlite_db.query(User).all()
    except Exception:
        users = [] # Might not exist if they never seeded admin

    sqlite_db.close()

    # 2. Connect to Neon to write data
    neon_url = os.environ.get("DATABASE_URL")
    if not neon_url:
        print("No DATABASE_URL provided")
        sys.exit(1)

    print("Connecting to Neon...")
    neon_engine = create_engine(neon_url)
    
    print("Creating tables in Neon...")
    Base.metadata.drop_all(bind=neon_engine)
    Base.metadata.create_all(bind=neon_engine)

    NeonSession = sessionmaker(bind=neon_engine)
    neon_db = NeonSession()

    print("Migrating subjects...")
    for s in subjects:
        # Avoid DetachedInstanceError by creating new instances
        neon_db.add(Subject(id=s.id, name=s.name))
        
    print("Migrating careers...")
    for c in careers:
        neon_db.add(Career(id=c.id, name=c.name, dimension_profile=c.dimension_profile, tags=c.tags, academic_weights=c.academic_weights))
        
    print("Migrating questions...")
    for q in questions:
        neon_db.add(Question(id=q.id, text=q.text, dimensions=q.dimensions, weight=q.weight))
        
    print("Migrating users...")
    for u in users:
        neon_db.add(User(id=u.id, name=u.name, email=u.email, hashed_password=u.hashed_password, role=u.role, created_at=u.created_at))

    neon_db.commit()
    neon_db.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
