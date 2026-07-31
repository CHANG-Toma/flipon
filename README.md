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
- `/test` — Démo interactive (solo ou duo 2 téléphones)

## Déploiement Vercel (duo)

Le mode **À deux** a besoin d’un Redis partagé (les fonctions serverless ne partagent pas la mémoire).

1. Sur [vercel.com](https://vercel.com) → ton projet → **Storage** → crée **Upstash Redis** (ou Vercel KV)
2. Relie-le au projet (ça ajoute `KV_REST_API_URL` + `KV_REST_API_TOKEN`)
3. **Redeploy**

En local, sans Redis, le duo marche quand même (Map en mémoire, un seul process).
