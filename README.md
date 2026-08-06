# FlipOn Web

Site vitrine et demo web de FlipOn.

Objectif: presenter le concept, expliquer les offres Basique/Boost, et permettre de tester le flow vote + resultat avant la version mobile complete.

## Positionnement du projet

- `flipon/` = web marketing + demo produit
- `flipon-app/` = application mobile principale (Expo)

## Fonctionnalites web

- Landing page avec proposition de valeur
- Page presentation du produit
- Page tarifs Basique vs Boost
- Page test pour simuler une session et un resultat
- Formulaire de feedback utilisateur

## Lancer en local

```bash
cd flipon
npm install
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Routes principales

- `/` : accueil
- `/presentation` : presentation produit
- `/tarifs` : offres
- `/test` : demo interactive
- `/download` : redirection iOS / Android

## Variables d environnement

Copier le fichier exemple puis renseigner les valeurs:

```bash
cp .env.example .env.local
```

### Infra locale (Docker) — tests avant o2switch

```bash
cp .env.docker.example .env.docker   # puis changer les mots de passe
# ou utiliser le .env.docker déjà généré en local

npm run db:up      # Postgres + Redis sur 127.0.0.1 uniquement
npm run db:push    # schéma Prisma
npm run db:studio  # UI optionnelle
```

Dans `.env` (lu par Prisma) et `.env.local` (Next) :

- `DATABASE_URL=postgresql://flipon:…@127.0.0.1:5432/flipon?schema=public&connection_limit=10`
- `REDIS_URL=redis://:…@127.0.0.1:6379`

> Prisma CLI lit `.env` (pas `.env.local`). Garder `DATABASE_URL` dans les deux, ou au minimum dans `.env`.

Sécurité locale : ports bindés sur `127.0.0.1`, auth SCRAM Postgres, Redis avec mot de passe, limites mémoire.

Quand les tests produit sont OK → basculer `DATABASE_URL` vers Postgres o2switch (`sslmode=require`) et Redis vers Upstash / Vercel.

Variables importantes:

- `REDIS_URL` : lobby duo (Docker local / Upstash / Vercel Storage)
- `DATABASE_URL` : Postgres (Docker local, o2switch, Neon, …) pour users / sessions / historique
- `CLERK_SECRET_KEY` : vérif JWT mobile + upsert user
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` : formulaire de feedback

Base de données:

```bash
# Avec DATABASE_URL dans .env.local
npm run db:push
```

## Deploiement

Deploiement recommande: Vercel.

Etapes:

1. Connecter le repository au projet Vercel
2. Ajouter les variables d environnement (`REDIS_URL`, `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`)
3. Lancer le deploy, puis promouvoir en production si necessaire

## Notes produit

- Les sessions duo ont une duree limitee (environ 24h, plus courte apres match).
- Le web sert a valider le message produit et l experience.
- Le coeur long terme de FlipOn est la mobile app.
