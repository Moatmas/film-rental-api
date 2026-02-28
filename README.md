# Film Rental API

API de gestion de locations de films avec notifications automatiques par email.

## Stack
- NestJS 11 + TypeORM
- PostgreSQL (base Sakila)
- @nestjs/schedule (CRON jobs)
- Luxon (timezone management)
- Swagger UI

## Installation

### Lancer le projet
```bash
npm install
npm run start:dev
```

## Documentation
Swagger UI : http://localhost:3000/api

## Fonctionnalités
- Gestion des clients avec support timezone (IANA)
- Locations avec règles métier (7 à 21 jours)
- Notifications automatiques J-5 et J-3 à 12h heure locale du client
- Tâches planifiées avec suivi d'état complet