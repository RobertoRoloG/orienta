import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine, SessionLocal
from app.models.domain import Base, Career, Question, Subject


def infer_tags(c):
    tags = []
    if c.get("logic", 0) >= 8: tags.append("Tecnología")
    if c.get("analytics", 0) >= 8 and c.get("activity", 0) < 5: tags.append("Ciencias")
    if c.get("social", 0) >= 8 and c.get("empathy", 0) >= 8: tags.append("Salud")
    if c.get("creativity", 0) >= 8: tags.append("Arte y Diseño")
    if c.get("structure", 0) >= 8 and c.get("social", 0) >= 5 and c.get("empathy", 0) < 8: tags.append("Negocios y Gestión")
    if c.get("verbal", 0) >= 8: tags.append("Humanidades")
    if c.get("activity", 0) >= 8: tags.append("Deportes")
    if c.get("manual", 0) >= 7 and c.get("empathy", 0) < 8: tags.append("Trabajo Manual/Laboratorio")
    if not tags: tags.append("General")
    return tags

def infer_academic_weights(c):
    weights = {}
    if c.get("logic", 0) >= 7: weights["1"] = 1.0 # Matemáticas
    if c.get("logic", 0) >= 8 and c.get("manual", 0) >= 3: weights["2"] = 0.8 # Física y Química
    if c.get("empathy", 0) >= 7 and c.get("activity", 0) >= 5: weights["3"] = 1.0 # Biología / Salud
    if c.get("creativity", 0) >= 8: weights["4"] = 1.0 # Dibujo / Arte
    if c.get("structure", 0) >= 8 and c.get("verbal", 0) >= 6: weights["5"] = 1.0 # Economía
    if c.get("verbal", 0) >= 8: weights["6"] = 1.0 # Historia
    return weights

def seed():
    db_initial = SessionLocal()
    existing_questions = []
    try:
        from app.models.domain import Question
        q_rows = db_initial.query(Question).all()
        for q in q_rows:
            existing_questions.append({
                "id": q.id,
                "text": q.text,
                "dimensions": q.dimensions,
                "weight": q.weight
            })
    except Exception as e:
        print("Could not read existing questions. Make sure the database exists.")
        return
    db_initial.close()

    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Seed Subjects
    print("Seeding subjects...")
    subjects = [
        {"id": 1, "name": "Matemáticas"},
        {"id": 2, "name": "Física y Química"},
        {"id": 3, "name": "Biología / Salud"},
        {"id": 4, "name": "Dibujo / Arte"},
        {"id": 5, "name": "Economía / Empresa"},
        {"id": 6, "name": "Historia / Humanidades"}
    ]
    for s in subjects:
        db.add(Subject(**s))
    db.commit()

    # Seed Careers (reloading from update_careers format)
    # Re-evaluating CAREERS from update_careers.py locally
    from update_careers import CAREERS
    print("Seeding careers with tags and weights...")
    for c_data in CAREERS:
        dim_profile = {
            "logic": c_data.get("logic", 0.0),
            "analytics": c_data.get("analytics", 0.0),
            "creativity": c_data.get("creativity", 0.0),
            "social": c_data.get("social", 0.0),
            "structure": c_data.get("structure", 0.0),
            "activity": c_data.get("activity", 0.0),
            "verbal": c_data.get("verbal", 0.0),
            "empathy": c_data.get("empathy", 0.0),
            "manual": c_data.get("manual", 0.0),
        }
        
        db_career = Career(
            name=c_data["name"],
            dimension_profile=dim_profile,
            tags=infer_tags(c_data),
            academic_weights=infer_academic_weights(c_data)
        )
        db.add(db_career)
    db.commit()
    print(f"Added {len(CAREERS)} careers.")
        
    print("Seeding questions...")
    for q_data in existing_questions:
        db_question = Question(
            id=q_data["id"],
            text=q_data["text"],
            dimensions=q_data["dimensions"],
            weight=q_data["weight"]
        )
        db.add(db_question)
    db.commit()
    print(f"Added {len(existing_questions)} questions.")

    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed()
