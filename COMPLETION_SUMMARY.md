# Résumé des modifications - Gestion Appels d'Offres Mairie de Goma

## ✅ Travail complété

Le backend FastAPI a été entièrement restructuré pour une meilleure logique métier et fonctionnalités avancées.

### 📊 Modèles de base de données

#### Modèles modifiés :

1. **User** - Ajout de relations `company` (back_populates) et `candidate_profile`
2. **Company** - Ajout de relation `owner` (back_populates)
3. **JobOffer** - Remplacement `is_published`/`is_rejected` par champ `status` (pending, published, rejected, closed, expired)
4. **Application** - Suppression de `resume_url`, ajout de `documents` avec cascade delete

#### Nouveaux modèles :

1. **CandidateProfile** - Profil détaillé des candidats (phone, address, skills, experience, bio)
2. **ApplicationDocument** - Gestion des documents uploadés (CV, diplôme, lettre de motivation, etc.)
3. **JobOfferReview** - Avis et signalements sur les offres
4. **EmailNotification** - Historique des emails envoyés

### 🔧 Services créés/améliorés

1. **email_service.py** - Gestion d'envoi d'emails (SMTP + stockage en BD)
   - Mode production (SMTP configuré)
   - Mode développement (logging)
   - Templates pour invitations et rejets

2. **file_service.py** - Gestion des uploads de fichiers
   - Validation des extensions (PDF, PNG, JPG, JPEG)
   - Vérification de la taille (5MB max)
   - Stockage organisé par candidature

3. **Services existants améliorés**
   - `auth_service.py` - Création automatique du profil candidat
   - `job_offer_service.py` - Nouvel API avec gestion des statuts
   - `application_service.py` - Gestion des documents et statuts

### 🛣️ Routes API

#### Authentification (`/api/auth`)

- ✅ POST `/register` - Inscription avec création du profil candidat
- ✅ POST `/login` - Connexion JWT
- ✅ GET `/me` - Profil utilisateur

#### Offres d'emploi (`/api/job-offers`)

- ✅ GET `/` - Lister les offres publiées
- ✅ POST `/` - Créer une offre (recruiter/admin)
- ✅ GET `/{id}` - Détails d'une offre
- ✅ PATCH `/{id}` - Mettre à jour (recruiter/admin)
- ✅ PATCH `/{id}/publish` - Publier (admin)
- ✅ PATCH `/{id}/reject` - Rejeter (admin)
- ✅ PATCH `/{id}/close` - Fermer (recruiter/admin)
- ✅ DELETE `/{id}` - Supprimer
- ✅ GET `/admin/pending` - Offres en attente (admin)
- ✅ GET `/recruiter/me` - Mes offres (recruiter)

#### Candidatures (`/api/applications`)

- ✅ POST `/` - Postuler (candidate)
- ✅ GET `/me` - Mes candidatures (candidate)
- ✅ GET `/recruiter` - Candidatures du recruteur (recruiter)
- ✅ GET `/admin` - Toutes les candidatures (admin)
- ✅ GET `/{id}` - Détails d'une candidature
- ✅ PATCH `/{id}/status` - Mettre à jour le statut
- ✅ POST `/{id}/documents` - Ajouter un document
- ✅ GET `/{id}/documents` - Lister les documents
- ✅ POST `/{id}/invite` - Envoyer une invitation
- ✅ DELETE `/{id}` - Supprimer

#### Profils candidat (`/api/profiles/candidate`)

- ✅ GET `/me` - Mon profil
- ✅ PATCH `/me` - Mettre à jour mon profil
- ✅ GET `/{user_id}` - Profil d'un candidat

#### Avis et modération (`/api/reviews`)

- ✅ POST `/` - Créer un avis (candidate)
- ✅ GET `/admin` - Tous les avis (admin)
- ✅ GET `/admin/reports` - Signalements (admin)
- ✅ PATCH `/{id}` - Mettre à jour un avis
- ✅ DELETE `/{id}` - Supprimer un avis

#### Admin (`/api/admin`)

- ✅ GET `/stats` - Statistiques complètes
- ✅ GET `/pipeline-overview` - Aperçu du pipeline des offres

### 👥 Contrôle d'accès basé sur les rôles

| Rôle          | Permissions                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| **Candidate** | Consulter offres, postuler, voir candidatures, ajouter documents, laisser avis |
| **Recruiter** | Créer/gérer offres, voir candidatures, envoyer invitations                     |
| **Admin**     | Valider/rejeter offres, voir tout, modérer avis, statistiques                  |

### 📁 Fichiers créés/modifiés

#### Nouveaux fichiers modèles :

- `app/models/candidate_profile.py`
- `app/models/application_document.py`
- `app/models/job_offer_review.py`
- `app/models/email_notification.py`

#### Nouveaux fichiers services :

- `app/services/email_service.py`
- `app/services/file_service.py`

#### Nouveaux fichiers routes :

- `app/routes/candidate_profile_routes.py`
- `app/routes/job_offer_review_routes.py`
- `app/routes/admin_routes.py`

#### Nouveaux fichiers schemas :

- `app/schemas/candidate_profile_schema.py`
- `app/schemas/application_document_schema.py`
- `app/schemas/job_offer_review_schema.py`
- `app/schemas/email_notification_schema.py`

#### Fichiers modifiés :

- `app/models/user.py` - Relations back_populates
- `app/models/company.py` - Relation owner
- `app/models/job_offer.py` - Status au lieu de booléens
- `app/models/application.py` - Documents + back_populates
- `app/routes/auth_routes.py` - Création du profil candidat
- `app/routes/job_offer_routes.py` - Routes complètes
- `app/routes/application_routes.py` - Upload + email
- `app/main.py` - Nouvelles routes + montage statique
- `app/config.py` - Paramètres email + upload
- `alembic/env.py` - Import des nouveaux modèles
- `.env` - Paramètres email/upload

#### Fichiers de configuration :

- `README.md` - Documentation complète
- `MIGRATION_GUIDE.md` - Instructions de migration
- `setup_migrations.py` - Script de génération des migrations
- `requirements_new.txt` - Dépendances à jour (python-multipart)
- `.env` - Variables d'environnement
- `frontend/.env` - Configuration Vite

### 🚀 Prochaines étapes

1. **Remplacer le fichier requirements.txt** :

   ```bash
   cp backend/requirements_new.txt backend/requirements.txt
   ```

2. **Installer les dépendances** :

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Générer et appliquer les migrations** :

   ```bash
   alembic revision --autogenerate -m "Restructuration - Nouveaux modèles"
   alembic upgrade head
   ```

4. **Lancer les serveurs** :
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `npm run dev`

5. **Tester l'API** : http://localhost:8000/docs

### 📝 Notes importantes

- Les fichiers uploadés sont stockés dans `backend/uploads/`
- En mode développement, les emails sont loggés (SMTP non configuré)
- CORS est activé sur toutes les origines (à restreindre en production)
- Les migrations Alembic doivent être exécutées après les modifications de modèles

### 🎯 Architecture respectée

✅ FastAPI + SQLAlchemy
✅ Alembic pour les migrations
✅ Pydantic pour la validation
✅ JWT pour l'authentification
✅ PostgreSQL comme base de données
✅ Tests de rôles en place
✅ Gestion d'erreurs appropriée
✅ Documentation OpenAPI intégrée

---

**Statut** : ✅ Transformation complète du backend terminée
**Date** : 14 mai 2026
