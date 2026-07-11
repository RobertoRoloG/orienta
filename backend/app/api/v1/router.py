from fastapi import APIRouter
from app.api.v1.endpoints import questions, scoring, matching, metadata, auth, results, careers

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(careers.router, prefix="/careers", tags=["careers"])
api_router.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
api_router.include_router(matching.router, prefix="/matching", tags=["matching"])
api_router.include_router(metadata.router, prefix="/metadata", tags=["metadata"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
