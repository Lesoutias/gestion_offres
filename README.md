# Gestion des Appels d'Offres - Mairie de Goma

Plateforme de gestion des offres d'emploi pour la Mairie de Goma.

## Architecture

### Backend (FastAPI)

- **Framework**: FastAPI
- **Base de données**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentification**: JWT (JSON Web Tokens)
- **Migrations**: Alembic

### Frontend (React + TypeScript)

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Build Tool**: Vite

## Configuration

### Backend Setup

1. Créer un environnement virtuel Python:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

2. Installer les dépendances:

```bash
pip install -r requirements.txt
```

3. Configurer l'environnement (.env):

```
DATABASE_URL="postgresql://user:password@localhost:5432/gestion_appels_offres"
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Email (optionnel)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

4. Exécuter les migrations:

```bash
alembic upgrade head
```

5. Lancer le serveur:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Installer les dépendances:

```bash
cd frontend
npm install
```

2. Configurer .env:

```
VITE_API_BASE_URL=/api
```

3. Lancer le serveur de développement:

```bash
npm run dev
```

4. Build pour la production:

```bash
npm run build
```

## Générer les migrations Alembic

Après avoir modifié les modèles, générer une migration:

```bash
cd backend
alembic revision --autogenerate -m "Description de la migration"
alembic upgrade head
```

## Modèles de base de données

### User

- id, email, full_name, hashed_password, is_active, role_id
- Relations: role, applications, company, candidate_profile

### Role

- id, name, description
- Relations: users, permissions

### Permission

- id, name, description
- Relations: roles

### Company

- id, name, description, owner_id
- Relations: job_offers, owner

### JobOffer

- id, title, description, location, status, created_at, company_id, recruiter_id
- Statuts: pending, published, rejected, closed, expired
- Relations: company, recruiter, applications, reviews

### Application

- id, job_offer_id, candidate_id, cover_letter, status, created_at
- Statuts: pending, reviewed, shortlisted, rejected, invited, accepted
- Relations: job_offer, candidate, documents

### ApplicationDocument

- id, application_id, document_type, file_url, file_name, file_mime_type, uploaded_at
- Types: cv, diploma, cover_letter, identity_card, certificate, other

### CandidateProfile

- id, user_id, phone, address, education_level, domain, skills, experience_years, bio
- Relations: user

### JobOfferReview

- id, job_offer_id, candidate_id, rating, comment, is_report, created_at
- Relations: job_offer, candidate

### EmailNotification

- id, application_id, recipient_email, subject, message, sent_at, sent_by_id
- Relations: application, sent_by

## Routes API

### Authentication

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur

### Job Offers

- `GET /api/job-offers` - Lister les offres publiées
- `GET /api/job-offers/{id}` - Détails d'une offre
- `POST /api/job-offers` - Créer une offre (recruiter/admin)
- `PATCH /api/job-offers/{id}` - Mettre à jour (recruiter/admin)
- `PATCH /api/job-offers/{id}/publish` - Publier (admin)
- `PATCH /api/job-offers/{id}/reject` - Rejeter (admin)
- `PATCH /api/job-offers/{id}/close` - Fermer
- `DELETE /api/job-offers/{id}` - Supprimer
- `GET /api/job-offers/admin/pending` - Offres en attente (admin)
- `GET /api/job-offers/recruiter/me` - Mes offres (recruiter)

### Applications

- `POST /api/applications` - Postuler
- `GET /api/applications/me` - Mes candidatures
- `GET /api/applications/recruiter` - Candidatures du recruteur
- `GET /api/applications/admin` - Toutes les candidatures (admin)
- `GET /api/applications/{id}` - Détails
- `PATCH /api/applications/{id}/status` - Mettre à jour le statut
- `POST /api/applications/{id}/documents` - Ajouter un document
- `GET /api/applications/{id}/documents` - Lister les documents
- `POST /api/applications/{id}/invite` - Envoyer une invitation
- `DELETE /api/applications/{id}` - Supprimer

### Candidate Profiles

- `GET /api/profiles/candidate/me` - Mon profil
- `PATCH /api/profiles/candidate/me` - Mettre à jour mon profil
- `GET /api/profiles/candidate/{user_id}` - Profil d'un candidat

### Reviews

- `POST /api/reviews` - Créer un avis
- `GET /api/reviews/admin` - Tous les avis (admin)
- `GET /api/reviews/admin/reports` - Signalements (admin)
- `PATCH /api/reviews/{id}` - Mettre à jour
- `DELETE /api/reviews/{id}` - Supprimer

### Admin

- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/pipeline-overview` - Aperçu du pipeline

## Rôles et permissions

### Candidate (Candidat)

- Consulter les offres publiées
- Postuler à une offre
- Voir ses candidatures
- Ajouter des documents
- Laisser un avis sur une offre

### Recruiter (Recruteur)

- Créer des offres
- Mettre à jour ses offres
- Voir les candidatures à ses offres
- Envoyer des invitations
- Laisser des avis

### Admin

- Valider/rejeter les offres
- Voir toutes les candidatures
- Voir les statistiques
- Modérer les avis et signalements

## Structure des fichiers

```
backend/
├── alembic/              # Migrations
│   └── versions/
├── app/
│   ├── models/          # Modèles SQLAlchemy
│   ├── schemas/         # Schémas Pydantic
│   ├── routes/          # Routes FastAPI
│   ├── services/        # Logique métier
│   ├── security/        # JWT, Password
│   ├── config.py        # Configuration
│   ├── database.py      # Connexion DB
│   └── main.py          # Application principale
├── requirements.txt
├── alembic.ini
└── .env

frontend/
├── src/
│   ├── app/             # Redux store
│   ├── components/      # Composants React
│   ├── features/        # Redux slices
│   ├── pages/           # Pages
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── context/         # Contexte React
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Notes de développement

- Les fichiers uploadés sont stockés dans le dossier `uploads/`
- Les emails sont loggés en mode développement (sans SMTP configuré)
- Les migrations Alembic doivent être exécutées avant de lancer l'app
- CORS est activé sur toutes les origines (à restreindre en production)
