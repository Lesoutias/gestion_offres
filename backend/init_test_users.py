#!/usr/bin/env python3
"""
Script pour initialiser les utilisateurs de test dans la base de données
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.models.role import Role
from app.security.password import hash_password

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Récupérer les rôles ou les créer
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        admin_role = Role(name="admin")
        db.add(admin_role)
        print("✅ Rôle 'admin' créé")
    
    recruiter_role = db.query(Role).filter(Role.name == "recruiter").first()
    if not recruiter_role:
        recruiter_role = Role(name="recruiter")
        db.add(recruiter_role)
        print("✅ Rôle 'recruiter' créé")
    
    candidate_role = db.query(Role).filter(Role.name == "candidate").first()
    if not candidate_role:
        candidate_role = Role(name="candidate")
        db.add(candidate_role)
        print("✅ Rôle 'candidate' créé")
    
    db.commit()
    db.refresh(admin_role)
    db.refresh(recruiter_role)
    db.refresh(candidate_role)
    
    # Vérifier et créer les utilisateurs de test
    test_users = [
        {
            "email": "admin@test.com",
            "password": "password",
            "full_name": "Admin User",
            "role": admin_role,
        },
        {
            "email": "recruiter@test.com",
            "password": "password",
            "full_name": "Recruiter User",
            "role": recruiter_role,
        },
        {
            "email": "candidate@test.com",
            "password": "password",
            "full_name": "Candidate User",
            "role": candidate_role,
        },
    ]
    
    for user_data in test_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            print(f"✓ Utilisateur {user_data['email']} déjà existant")
        else:
            user = User(
                email=user_data["email"],
                hashed_password=hash_password(user_data["password"]),
                full_name=user_data["full_name"],
                role_id=user_data["role"].id,
                is_active=True,
            )
            db.add(user)
            db.commit()
            print(f"✅ Utilisateur {user_data['email']} créé avec succès (rôle: {user_data['role'].name})")
    
    print("\n✅ Initialisation des utilisateurs de test terminée!")
    
finally:
    db.close()
