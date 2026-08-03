# FlipOn

MVP web — application couple anti-routine.

## Lancer

```bash
cd flipon
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — Landing + waitlist
- `/presentation` — Présentation produit
- `/tarifs` — Basique (gratuit) et Boost IA
- `/test` — Démo interactive (solo ou duo 2 téléphones)

## Déploiement Vercel (duo)

1. Crée un **Redis Free** (Storage)
2. **Connect to Project** → projet `flipon` (ajoute `REDIS_URL`)
3. Push le code à jour + **Redeploy**

Sessions : TTL 24 h en cours, ~15 min après le match, max 2 jours.

## Feedback e-mail (page /test)

1. Va sur [web3forms.com](https://web3forms.com), entre **ton e-mail**, récupère l’`access_key`
2. Dans Vercel → Project → Settings → Environment Variables :
   - `WEB3FORMS_ACCESS_KEY` = ta clé
3. Redeploy

En local : copie `.env.example` → `.env.local` et remplis la même variable.

