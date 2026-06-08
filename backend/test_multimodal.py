import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.domain import Career
from app.services.matching import rank_careers

db = SessionLocal()
careers = db.query(Career).all()
career_dicts = []
for c in careers:
    c_dict = c.dimension_profile.copy()
    c_dict["name"] = c.name
    c_dict["tags"] = c.tags
    c_dict["academic_weights"] = c.academic_weights
    career_dicts.append(c_dict)

user_profile = {
    "logic": 8.0,
    "analytics": 8.0,
    "creativity": 3.0,
    "social": 4.0,
    "structure": 7.0,
    "activity": 2.0,
    "verbal": 5.0,
    "empathy": 2.0,
    "manual": 1.0
}

tastes = ["Tecnología", "Ciencias"]
grades = [
    {"subject_id": 1, "score": 9.5},  # Mates
    {"subject_id": 2, "score": 8.0}   # Física
]

print("--- FULL PAYLOAD ---")
ranked = rank_careers(user_profile, career_dicts, user_tastes=tastes, user_grades=grades)
for c in ranked[:3]:
    print(f"- {c['name']} | Match: {c['match']}% | Test: {c['breakdown']['test']} | Tastes: {c['breakdown']['tastes']} | Grades: {c['breakdown']['grades']}")

print("\n--- ONLY TEST ---")
ranked2 = rank_careers(user_profile, career_dicts)
for c in ranked2[:3]:
    print(f"- {c['name']} | Match: {c['match']}%")

print("\n--- TEST + GRADES ---")
ranked3 = rank_careers(user_profile, career_dicts, user_grades=grades)
for c in ranked3[:3]:
    print(f"- {c['name']} | Match: {c['match']}% | Test: {c['breakdown']['test']} | Grades: {c['breakdown']['grades']}")

db.close()
