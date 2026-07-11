import argparse
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.domain import User
from app.core.security import get_password_hash

def seed_admin(email: str, password: str, name: str):
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == email).first()
        if admin:
            print(f"User with email {email} already exists.")
            return

        new_admin = User(
            name=name,
            email=email,
            hashed_password=get_password_hash(password),
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print(f"Successfully created admin user: {email}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed an admin user")
    parser.add_argument("--email", type=str, required=True, help="Admin email")
    parser.add_argument("--password", type=str, required=True, help="Admin password")
    parser.add_argument("--name", type=str, default="Admin", help="Admin name")
    args = parser.parse_args()

    seed_admin(args.email, args.password, args.name)
