import sys
import os

# Add the backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.matching import rank_careers
from app.data.careers import CAREERS

PROFILES = {
    "El Informático Puro": {
        "logic": 10.0, "analytics": 9.0, "creativity": 6.0, "social": 2.0, "structure": 8.0, "activity": 2.0, "verbal": 3.0
    },
    "La Médica Vocacional": {
        "logic": 7.0, "analytics": 7.0, "creativity": 4.0, "social": 9.0, "structure": 10.0, "activity": 7.0, "verbal": 7.0
    },
    "El Artista / Diseñador": {
        "logic": 4.0, "analytics": 4.0, "creativity": 10.0, "social": 6.0, "structure": 4.0, "activity": 3.0, "verbal": 6.0
    },
    "El Gestor / Negocios": {
        "logic": 6.0, "analytics": 7.0, "creativity": 6.0, "social": 8.0, "structure": 9.0, "activity": 4.0, "verbal": 8.0
    },
    "El Científico de Laboratorio": {
        "logic": 9.0, "analytics": 9.0, "creativity": 4.0, "social": 3.0, "structure": 9.0, "activity": 4.0, "verbal": 4.0
    }
}

def run_simulation():
    print("=" * 50)
    print("RESULTADOS DE LA SIMULACIÓN")
    print("=" * 50)
    for name, profile in PROFILES.items():
        print(f"\nPerfil: {name}")
        ranked = rank_careers(profile, CAREERS)
        for i, career in enumerate(ranked[:4], 1):
            print(f"  {i}. {career['name']} - {career['match']}%")

if __name__ == "__main__":
    run_simulation()
