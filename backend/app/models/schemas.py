from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

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

class QuestionSchema(BaseModel):
    id: int
    text: str

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
    name: str
    match: float = Field(..., description="Porcentaje de compatibilidad de 0 a 100")
    breakdown: Optional[Dict[str, float]] = Field(None, description="Desglose de puntuaciones")
