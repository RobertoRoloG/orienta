from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, ForeignKey

from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True) # Can be null if taken anonymously

    dimension_scores = Column(JSON, nullable=False)
    tastes = Column(JSON, nullable=True)
    grades = Column(JSON, nullable=True)
    top_careers = Column(JSON, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    dimension_profile = Column(JSON, nullable=False) # e.g. {"logic": 10, "empathy": 5}
    tags = Column(JSON, nullable=True) # for future tastes/interests
    academic_weights = Column(JSON, nullable=True) # for future academic grades
    
    job_prospects = Column(JSON, nullable=True) # e.g. ["Desarrollador Web", "Ingeniero de Datos"]
    average_salary = Column(String, nullable=True) # e.g. "30.000€ - 45.000€"
    employability_rate = Column(Float, nullable=True) # e.g. 85.5
    graduation_rate = Column(Float, nullable=True) # e.g. 60.0
    regret_rate = Column(Float, nullable=True) # e.g. 15.0
    market_data_updated_at = Column(DateTime(timezone=True), nullable=True)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    dimensions = Column(JSON, nullable=False) # e.g. ["logic", "analytics"]
    weight = Column(Float, nullable=False, default=1.0)

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
