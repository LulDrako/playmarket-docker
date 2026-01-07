# PlayMarket – Déploiement Docker

## Objectif
Déployer une application web composée d’une API, de bases de données et d’un front-end
via Docker et Docker Compose, sur toute machine disposant de Docker.

---

## Prérequis
- Docker (>= 24)
- Docker Compose
- Linux / macOS / Windows (Docker Desktop)

Vérification :
docker -v
docker compose version

---

## Lancement du projet

### 1. Configuration
```bash
cp .env.example .env
# Éditer .env et modifier les valeurs (mots de passe, secrets JWT, etc.)
```

### 2. Build et démarrage
```bash
docker compose up --build
```

### 3. Arrêt des services
```bash
docker compose down
# Pour supprimer aussi les volumes : docker compose down -v
```

## Variables d'environnement

Principales variables à configurer dans `.env` :

- `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` : Configuration PostgreSQL
- `MONGODB_URI` : URI de connexion MongoDB
- `JWT_SECRET`, `JWT_REFRESH_SECRET` : Secrets pour les tokens JWT (minimum 32 caractères)
- `ALLOWED_ORIGINS` : Origines autorisées pour CORS

---

## Accès aux services

Frontend : http://localhost:8080  
Backend API : http://localhost:3000  

---

## Architecture

### Services

- **Frontend** : React (Vite) → Nginx (port 8080)
- **Backend** : API Node.js/Express (port 3000)
- **PostgreSQL** : Base de données relationnelle (port 5432)
- **MongoDB** : Base de données NoSQL (port 27017)

### Schéma d'architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                       │
│              (playmarket-network)                       │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Frontend   │────────▶│   Backend    │            │
│  │  (Nginx)     │  /api   │  (Node.js)   │            │
│  │  :8080       │         │  :3000       │            │
│  └──────────────┘         └──────┬───────┘            │
│                                  │                     │
│                    ┌─────────────┴─────────────┐      │
│                    │                           │      │
│            ┌───────▼──────┐          ┌────────▼────┐ │
│            │  PostgreSQL  │          │   MongoDB   │ │
│            │   :5432      │          │   :27017    │ │
│            └──────────────┘          └─────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘

Volumes:
├── postgres_data (persistance PostgreSQL)
└── mongo_data (persistance MongoDB)

Flux principaux:
1. Client → Frontend (Nginx) :80
2. Frontend → Backend : /api → backend:3000
3. Backend → PostgreSQL : connexion directe
4. Backend → MongoDB : connexion directe
```

### Fonctionnement

- **Réseau Docker** : `playmarket-network` (user-defined bridge)
- **Volumes** : Persistance des données PostgreSQL et MongoDB
- **Communication** : Frontend proxy `/api` vers backend
- **Healthchecks** : PostgreSQL et MongoDB vérifiés avant démarrage backend

---

## Sécurité et bonnes pratiques

- ✅ Variables sensibles dans `.env` (non commité via `.gitignore`)
- ✅ Images Docker officielles (Alpine pour réduire la taille)
- ✅ Backend exécuté avec utilisateur non-root (`nodejs`)
- ✅ Builds multi-stage pour optimiser les images
- ✅ Healthchecks sur les bases de données
- ✅ Réseau Docker isolé (user-defined bridge)
- ✅ Volumes nommés pour la persistance des données

## Choix techniques

- **Multi-stage builds** : Réduction de la taille des images finales
- **Nginx pour le frontend** : Serveur web performant et léger
- **Alpine Linux** : Images minimales pour sécurité et performance
- **Healthchecks** : Démarrage ordonné des services (BDD → Backend → Frontend)
