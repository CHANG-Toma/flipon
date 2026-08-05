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

Variables importantes:

- `REDIS_URL` : lobby duo (Upstash / Vercel Storage)
- `DATABASE_URL` : Postgres (o2switch, Neon, …) pour users / sessions / historique
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
2. Ajouter les variables d environnement (`REDIS_URL`, `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`)
3. Lancer le deploy, puis promouvoir en production si necessaire

## Notes produit

- Les sessions duo ont une duree limitee (environ 24h, plus courte apres match).
- Le web sert a valider le message produit et l experience.
- Le coeur long terme de FlipOn est la mobile app.
