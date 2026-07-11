import os
import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List

from app.models.domain import Career

class CareerMarketData(BaseModel):
    average_salary: str
    job_prospects: List[str]

def update_career_market_data_if_needed(career: Career, db: Session) -> Career:
    """
    Checks if the career's market data is older than 30 days or empty.
    If so, queries Groq for updated data, saves it to the DB, and returns the updated career.
    """
    now = datetime.now(timezone.utc)
    
    # Check if data exists and is less than 30 days old
    if career.market_data_updated_at and career.average_salary and career.job_prospects:
        is_simulated = "simulado" in career.average_salary.lower()
        if not is_simulated:
            # Ensure db datetime is offset-aware for comparison
            updated_at = career.market_data_updated_at
            if updated_at.tzinfo is None:
                updated_at = updated_at.replace(tzinfo=timezone.utc)
                
            # Check if difference is less than 30 days
            diff = now - updated_at
            if diff.days < 30:
                return career

    # Needs update
    from app.core.config import settings
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        print(f"Warning: GEMINI_API_KEY not found. Using fallback data for {career.name}.")
        return _apply_fallback_data(career, db, now)
        
    try:
        print(f"Fetching fresh market data for {career.name} using Gemini with Google Search Grounding...")
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        Actúa como un analista experto del mercado laboral en España.
        Busca información en internet en tiempo real y devuélveme un objeto JSON sobre la carrera: "{career.name}".
        Necesito que estimes y busques los datos reales actuales.

        REGLA ESTRICTA DE FUENTES: 
        Para tus estimaciones y búsquedas, prioriza EXCLUSIVAMENTE fuentes oficiales, informes estadísticos y portales de empleo fiables de España (como el INE, SEPE, InfoJobs, Glassdoor, Randstad, o informes de universidades). 
        IGNORA por completo foros de opinión (como Reddit o Forocoches), blogs personales o artículos sin base estadística, para que los datos no estén sesgados.


        Devuelve el resultado ÚNICAMENTE en formato JSON estricto siguiendo esta estructura exacta, usando números flotantes de 0 a 100 para los porcentajes:
        {{
            "average_salary": "sueldo medio numérico aproximado en euros para España (ej. '24.000€ - 35.000€')",
            "job_prospects": ["salida profesional 1", "salida profesional 2", "salida 3", "salida 4"],
            "employability_rate": 0.0,
            "graduation_rate": 0.0,
            "regret_rate": 0.0
        }}
        Asegúrate de que las tasas (employability_rate, graduation_rate, regret_rate) sean realistas y basadas en datos encontrados si es posible. No pongas el mismo porcentaje para todas las carreras.
        No incluyas markdown (como ```json), texto adicional ni saludos, sólo el JSON bruto.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[{"google_search": {}}],
                temperature=0.3
            )
        )
        
        # Parse JSON
        raw_text = response.text or ""
        clean_text = raw_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_text)
        
        # Update DB Model
        career.average_salary = data.get("average_salary", "Sin datos")
        career.job_prospects = data.get("job_prospects", ["Sin datos disponibles"])
        career.employability_rate = data.get("employability_rate")
        career.graduation_rate = data.get("graduation_rate")
        career.regret_rate = data.get("regret_rate")
        career.market_data_updated_at = now
        
        db.commit()
        db.refresh(career)
        print(f"Successfully updated {career.name} via Gemini Search.")
        return career
        
    except Exception as e:
        print(f"Error fetching data from Gemini for {career.name}: {e}")
        return _apply_fallback_data(career, db, now)

def _apply_fallback_data(career: Career, db: Session, now: datetime) -> Career:
    career.average_salary = "20.000€ - 30.000€ (Datos simulados)"
    career.job_prospects = [
        "Especialista Junior",
        "Analista en " + career.name,
        "Consultor",
        "Investigación y Desarrollo"
    ]
    career.employability_rate = 75.0
    career.graduation_rate = 65.0
    career.regret_rate = 20.0
    career.market_data_updated_at = now
    db.commit()
    db.refresh(career)
    return career
