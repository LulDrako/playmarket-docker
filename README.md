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
cp .env.example .env

### 2. Build et démarrage
docker compose up --build

---

## Accès aux services

Frontend : http://localhost:8080  
Backend API : http://localhost:3000  

---

## Architecture

Services :
- Frontend : React
- Backend : API Node.js
- PostgreSQL : base de données relationnelle
- MongoDB : base de données NoSQL

Fonctionnement :
- Réseau Docker dédié
- Volumes Docker pour la persistance des données
- Communication frontend → backend via /api

---

## Sécurité et bonnes pratiques
- Variables sensibles dans .env (non commité)
- Images Docker officielles
- Backend exécuté avec un utilisateur non-root

---

## Arrêt des services
docker compose down
