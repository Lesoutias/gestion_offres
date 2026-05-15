# Instructions de migration et de déploiement

## 1. Mise à jour de requirements.txt

Le fichier `backend/requirements.txt` semble avoir un problème d'encodage. Remplacez-le par le contenu de `backend/requirements_new.txt`:

```bash
cd backend
# Faire une sauvegarde
cp requirements.txt requirements.txt.bak
# Remplacer par la nouvelle version
cp requirements_new.txt requirements.txt
```

## 2. Installer les dépendances

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

## 3. Générer les migrations Alembic

```bash
cd backend
alembic revision --autogenerate -m "Restructuration complète - Nouveaux modèles"
alembic upgrade head
```

Ou utiliser le script Python fourni:

```bash
python setup_migrations.py
```

## 4. Lancer les serveurs

Dans un terminal:

```bash
cd backend
uvicorn app.main:app --reload
```

Dans un autre terminal:

```bash
cd frontend
npm run dev
```

## 5. Vérifier que tout fonctionne

- Backend API: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Health check: http://localhost:8000/health

## 6. Paramètres supplémentaires

### Email (optionnel)

Si vous voulez que les emails d'invitation soient véritablement envoyés:

1. Modifiez `.env`:

```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app  # App password, not your regular password
SMTP_FROM_EMAIL=votre_email@gmail.com
```

### Upload de fichiers

Les fichiers uploadés sont stockés dans `backend/uploads/` et accessibles via `/uploads/`.

## Checklist de déploiement

- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées (.env)
- [ ] Migrations Alembic exécutées
- [ ] Dépendances Python installées (pip install -r requirements.txt)
- [ ] Dépendances Node installées (npm install)
- [ ] Serveur backend lancé (uvicorn)
- [ ] Serveur frontend lancé (npm run dev)
- [ ] API documentation accessible (http://localhost:8000/docs)
- [ ] Frontend accessible (http://localhost:5173)

## Troubleshooting

### Erreur de connexion à PostgreSQL

```
ERREUR: could not connect to server: Connection refused
```

- Vérifiez que PostgreSQL est lancé
- Vérifiez la connexion dans DATABASE_URL du .env

### Erreur: "ModuleNotFoundError"

- Vérifiez que vous êtes dans le bon répertoire
- Vérifiez que l'environnement virtuel est activé
- Réinstallez les dépendances: `pip install -r requirements.txt`

### Erreur: "CORS error"

- C'est normal en mode développement
- Vérifiez que le proxy Vite est correctement configuré
- Vérifiez que l'URL du backend est correcte dans le .env du frontend

### Fichiers uploadés non accessibles

- Vérifiez que le dossier `uploads/` existe
- Vérifiez les permissions d'accès au dossier
- Vérifiez que le serveur StaticFiles est bien configuré dans main.py
