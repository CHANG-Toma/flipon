# FlipOn

Site MVP pour tester FlipOn : voter en privé et trouver une activité que tout le groupe accepte.

Le vrai produit sera l’app mobile. Ici = landing + démo web.

## Lancer en local

```bash
cd flipon
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Contenu |
|-------|---------|
| `/` | Accueil + waitlist |
| `/presentation` | Le produit en une page |
| `/tarifs` | Basique / Boost |
| `/test` | Démo solo ou duo (2 téléphones) |

## Variables d’environnement

Voir `.env.example`.

- `REDIS_URL` — obligatoire en prod pour le duo (Vercel Redis / Upstash)
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — pour recevoir les retours du formulaire `/test`

## Déploiement (Vercel)

1. Brancher Redis au projet (`REDIS_URL`)
2. Ajouter `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` si tu veux le feedback
3. Push / redeploy — et **Promote to Production** si besoin

Les sessions duo durent ~24 h (plus court après un match).
