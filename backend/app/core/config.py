from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Orienta Backend API"
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    GEMINI_API_KEY: Optional[str] = None
    
    # CORS Origins (by default permit Next.js on localhost:3000)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://orienta-m2jdlj12y-roberto-r-s-projects.vercel.app",
        "https://orienta.vercel.app",
        "https://orienta-hazel.vercel.app",
    ]
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        extra="ignore",
        extra_environ_variables_to_override=True
    )

settings = Settings()
