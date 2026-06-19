# Prochaines étapes immédiates 🚀

## 1️⃣ Corriger l'encodage de requirements.txt

Le fichier original a un problème d'encodage UTF-16. Résolvez-le :

```bash
cd backend

# Option 1: Remplacer par la nouvelle version
cp requirements_new.txt requirements.txt

# Option 2: Recréer manuellement
# Copiez le contenu de requirements_new.txt dans requirements.txt
```

## 2️⃣ Installer les dépendances Python

```bash
cd backend
pip install -r requirements.txt
```

**Packages clés installés:**

- fastapi==0.136.1
- sqlalchemy==2.0.49
- alembic==1.18.4
- pydantic==2.13.4
- psycopg2-binary==2.9.10
- python-multipart==0.0.6 (nouveau - pour les uploads)

## 3️⃣ Générer les migrations Alembic

```bash
cd backend

# Générer la migration
alembic revision --autogenerate -m "Restructuration - Nouveaux modèles et statuts"

# Voir le fichier généré dans alembic/versions/
ls alembic/versions/

# Vérifier la migration avant d'appliquer
# Vous pouvez éditer le fichier généré si nécessaire

# Appliquer la migration
alembic upgrade head
```

**Ou utiliser le script Python :**

```bash
python setup_migrations.py
```

## 4️⃣ Lancer le backend

```bash
cd backend

# Activez l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Lancez le serveur
uvicorn app.main:app --reload
```

**Vous devriez voir :**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

## 5️⃣ Lancer le frontend

Dans un autre terminal :

```bash
cd frontend
npm install  # Si pas déjà fait
npm run dev
```

**Vous devriez voir :**

```
  VITE v5.4.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

## 6️⃣ Vérifier que tout fonctionne

1. **Documentation API** : http://localhost:8000/docs
   - Testez les endpoints depuis Swagger UI
   - Essayez POST /api/auth/register

2. **Frontend** : http://localhost:5173
   - Vous devriez voir la page de connexion
   - Le dashboard devrait maintenant afficher les statistiques

3. **Health check** : http://localhost:8000/health
   - Devrait répondre: `{"status": "healthy"}`

## 7️⃣ Tester les nouvelles fonctionnalités

### Créer un utilisateur candidat

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "password123",
    "full_name": "Jean Candidat",
    "role_name": "candidate"
  }'
```

### Se connecter

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "password123"
  }'
```

Récupérez le `access_token` de la réponse.

### Récupérer mon profil

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mettre à jour mon profil candidat

```bash
curl -X PATCH "http://localhost:8000/api/profiles/candidate/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+243999999999",
    "address": "Goma, DRC",
    "education_level": "licence",
    "domain": "informatique",
    "skills": "Python, FastAPI, React",
    "experience_years": 3,
    "bio": "Développeur fullstack passionné"
  }'
```

## 8️⃣ Configuration optionnelle - Emails

Si vous voulez que les invitations soient réellement envoyées :

1. Utilisez un email Gmail avec App Password
2. Modifiez `.env` :
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_EMAIL=your_email@gmail.com
   ```
3. Redémarrez le backend

**Note:** En mode dev sans SMTP configuré, les emails sont juste loggés.

## 🔍 Dépannage rapide

### Erreur: "Relation does not exist"

```
sqlalchemy.exc.ProgrammingError:
(psycopg2.errors.UndefinedTable) relation "job_offers" does not exist
```

**Solution:**

```bash
cd backend
alembic upgrade head
```

### Erreur: "ModuleNotFoundError: No module named 'python_multipart'"

```bash
pip install python-multipart
```

### Erreur: "Connection refused" (PostgreSQL)

```bash
# Linux/Mac
sudo systemctl start postgresql

# Ou lancez PostgreSQL manuellement
```

### Frontend ne se connecte pas au backend

- Vérifiez que le backend est lancé sur http://localhost:8000
- Vérifiez la config Vite dans vite.config.ts
- Vérifiez le .env du frontend

## 📋 Fichiers à consulter

- **README.md** - Documentation complète
- **MIGRATION_GUIDE.md** - Guide détaillé
- **COMPLETION_SUMMARY.md** - Résumé des modifications
- **VERIFICATION_CHECKLIST.md** - Checklist complète
- **app/main.py** - Point d'entrée
- **alembic/versions/** - Historique des migrations

## ✨ Prêt !

Une fois que vous avez complété les étapes 1-6, l'application devrait être entièrement fonctionnelle avec :

✅ Nouvelles routes API
✅ Gestion des documents uploadés
✅ Service d'emails
✅ Statuts dynamiques des offres
✅ Profils candidat enrichis
✅ Dashboard avec statistiques
✅ Contrôle d'accès par rôle

**Bonne chance ! 🚀**
