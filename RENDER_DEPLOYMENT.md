# Instructions de Déploiement sur Render

## 1. Prérequis
- Compte Render (https://render.com)
- Code pushé sur GitHub

## 2. Créer une base de données PostgreSQL sur Render

1. Aller sur https://render.com
2. Cliquer sur "New" → "PostgreSQL"
3. Remplir les détails:
   - Name: `bcgsquiz-db`
   - Database: `quizdb`
   - User: (auto-généré)
   - Region: `Frankfurt` (ou votre région)

4. Copier le `Internal Database URL` dans `.env` → `DATABASE_URL`

## 3. Créer un service Web sur Render

1. Cliquer sur "New" → "Web Service"
2. Connecter votre repo GitHub
3. Remplir les détails:
   - **Name**: `bcgsquiz-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: `Frankfurt`

4. Ajouter les variables d'environnement:
   - **DATABASE_URL**: (copier du service PostgreSQL)
   - **SECRET_JWT**: (générer une clé secrète sécurisée)
   - **NODE_ENV**: `production`

## 4. Configuration .env pour Render

Créer un fichier `.env` en production avec:
```
DATABASE_URL=postgresql://...@dpg-xxx.onrender.com/quizdb?ssl=true
SECRET_JWT=votre_clé_secrète_complexe
NODE_ENV=production
```

## 5. Dépannage

- **"impossible d'obtenir"**: Vérifier DATABASE_URL et les logs Render
- **CORS errors**: Ajouter à index.js si nécessaire:
  ```javascript
  const cors = require('cors');
  app.use(cors());
  ```

- **Port**: Render fournit automatiquement un port via `process.env.PORT`
