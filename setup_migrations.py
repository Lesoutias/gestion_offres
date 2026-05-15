#!/usr/bin/env python
"""
Script de setup pour générer et appliquer les migrations Alembic.
Usage: python setup_migrations.py
"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None):
    """Exécute une commande shell."""
    print(f"\n> {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd)
    if result.returncode != 0:
        print(f"✗ Erreur lors de l'exécution: {' '.join(cmd)}")
        return False
    print(f"✓ Succès")
    return True


def main():
    backend_dir = Path(__file__).parent / "backend"
    
    if not backend_dir.exists():
        print(f"✗ Le répertoire backend n'existe pas: {backend_dir}")
        sys.exit(1)
    
    print("=" * 60)
    print("Setup des migrations Alembic")
    print("=" * 60)
    
    # 1. Générer la migration
    print("\n1. Génération de la migration...")
    if not run_command(
        ["alembic", "revision", "--autogenerate", "-m", "Restructuration complète - Nouveaux modèles"],
        cwd=backend_dir
    ):
        sys.exit(1)
    
    # 2. Appliquer les migrations
    print("\n2. Application des migrations...")
    if not run_command(
        ["alembic", "upgrade", "head"],
        cwd=backend_dir
    ):
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✓ Setup des migrations terminé avec succès!")
    print("=" * 60)
    print("\nProchaines étapes:")
    print("1. Lancer le backend: cd backend && uvicorn app.main:app --reload")
    print("2. Lancer le frontend: cd frontend && npm run dev")


if __name__ == "__main__":
    main()
