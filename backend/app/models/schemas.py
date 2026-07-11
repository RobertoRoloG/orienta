from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class UserProfileSchema(BaseModel):
    logic: float = Field(..., description="Puntuación en dimensión lógica")
    analytics: float = Field(..., description="Puntuación en dimensión analítica")
    creativity: float = Field(..., description="Puntuación en dimensión creativa")
    social: float = Field(..., description="Puntuación en dimensión social")
    structure: float = Field(..., description="Puntuación en dimensión de estructura")
    activity: float = Field(..., description="Puntuación en dimensión de actividad física")
    verbal: float = Field(..., description="Puntuación en dimensión verbal")
    empathy: float = Field(..., description="Puntuación en dimensión de empatía")
    manual: float = Field(..., description="Puntuación en dimensión de habilidad manual")

class QuestionReadPublic(BaseModel):
    id: int
    text: str

class QuestionSchema(BaseModel):
    id: int
    text: str
    dimensions: List[str]
    weight: float

class QuestionCreate(BaseModel):
    text: str
    dimensions: List[str]
    weight: float

class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    dimensions: Optional[List[str]] = None
    weight: Optional[float] = None

class CareerSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    dimension_profile: Dict[str, float]
    tags: Optional[List[str]] = None
    academic_weights: Optional[Dict[str, float]] = None
    job_prospects: Optional[List[str]] = None
    average_salary: Optional[str] = None
    employability_rate: Optional[float] = None
    graduation_rate: Optional[float] = None
    regret_rate: Optional[float] = None
    market_data_updated_at: Optional[datetime] = None

class CareerCreate(BaseModel):
    name: str
    description: Optional[str] = None
    dimension_profile: Dict[str, float]
    tags: Optional[List[str]] = None
    academic_weights: Optional[Dict[str, float]] = None
    job_prospects: Optional[List[str]] = None
    average_salary: Optional[str] = None
    employability_rate: Optional[float] = None
    graduation_rate: Optional[float] = None
    regret_rate: Optional[float] = None

class CareerUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    dimension_profile: Optional[Dict[str, float]] = None
    tags: Optional[List[str]] = None
    academic_weights: Optional[Dict[str, float]] = None
    job_prospects: Optional[List[str]] = None
    average_salary: Optional[str] = None
    employability_rate: Optional[float] = None
    graduation_rate: Optional[float] = None
    regret_rate: Optional[float] = None
    market_data_updated_at: Optional[datetime] = None

class AnswerSubmitSchema(BaseModel):
    answers: List[int] = Field(
        ...,
        min_length=1,
        description="Lista de respuestas numéricas (escala 1-5)"
    )

class SubjectSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class UserGradeSchema(BaseModel):
    subject_id: int
    score: float = Field(..., ge=0.0, le=10.0)

class MatchingRequestSchema(BaseModel):
    profile: UserProfileSchema = Field(..., description="Perfil de dimensiones del test")
    tastes: Optional[List[str]] = Field(None, description="Lista de etiquetas/gustos seleccionados")
    grades: Optional[List[UserGradeSchema]] = Field(None, description="Notas del usuario por asignatura")

class CareerProfileSchema(BaseModel):
    name: str
    logic: float
    analytics: float
    creativity: float
    social: float
    structure: float
    activity: float
    verbal: float
    empathy: float
    manual: float

class RankedCareerSchema(BaseModel):
    id: int
    name: str
    match: float = Field(..., description="Porcentaje de compatibilidad de 0 a 100")
    breakdown: Optional[Dict[str, float]] = Field(None, description="Desglose de puntuaciones")

class TestResultCreate(BaseModel):
    dimension_scores: UserProfileSchema
    tastes: Optional[List[str]] = None
    grades: Optional[List[UserGradeSchema]] = None
    top_careers: List[RankedCareerSchema]

from datetime import datetime

class TestResultRead(BaseModel):
    id: int
    user_id: Optional[int]
    dimension_scores: dict
    tastes: Optional[list]
    grades: Optional[list]
    top_careers: list
    created_at: datetime

    class Config:
        from_attributes = True

